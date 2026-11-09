use std::error::Error;
use std::fmt;
use std::sync::{Arc, atomic::{AtomicUsize, Ordering}};

struct Lease(Arc<AtomicUsize>);
impl Drop for Lease { fn drop(&mut self) { self.0.fetch_add(1, Ordering::SeqCst); } }

#[derive(Debug)]
pub struct BoundaryError { cause: std::io::Error }
impl fmt::Display for BoundaryError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result { write!(f, "opening payload failed") }
}
impl Error for BoundaryError { fn source(&self) -> Option<&(dyn Error + 'static)> { Some(&self.cause) } }

/// Own only the acquired lease; the caller retains the counter used to observe release.
pub fn open_payload(fail: bool, releases: Arc<AtomicUsize>) -> Result<(), BoundaryError> {
    let lease = Lease(releases);
    if fail {
        if std::env::var("CRAFT_ENGINEERING_DEFECTIVE").as_deref() == Ok("1") {
            std::mem::forget(lease); // Deliberate faulty branch: leak ownership on failure.
        }
        return Err(BoundaryError { cause: std::io::Error::new(std::io::ErrorKind::Other, "payload unavailable") });
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn failure_releases_and_preserves_cause() {
        let count = Arc::new(AtomicUsize::new(0));
        let error = open_payload(true, count.clone()).unwrap_err();
        assert_eq!(error.source().unwrap().to_string(), "payload unavailable");
        assert_eq!(count.load(Ordering::SeqCst), 1, "EP-RS-01 acquired lease must be released");
    }
    #[test]
    fn success_releases_owned_lease() {
        let count = Arc::new(AtomicUsize::new(0));
        open_payload(false, count.clone()).unwrap();
        assert_eq!(count.load(Ordering::SeqCst), 1);
    }
}
