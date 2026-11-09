use std::{fs, io::Read, path::{Component, Path}};

/// Deliberately flawed baseline: the caller can leave the allowed directory.
pub fn read_document_defective(root: &Path, name: &str) -> Result<String, String> {
    fs::read_to_string(root.join(name)).map_err(|_| "read failed".into())
}

pub fn read_document(root: &Path, name: &str) -> Result<String, String> {
    if name.is_empty() || Path::new(name).components().any(|part| !matches!(part, Component::Normal(_))) {
        return Err("invalid document name".into());
    }
    let root=fs::canonicalize(root).map_err(|_| "document root unavailable")?;
    let file=fs::canonicalize(root.join(name)).map_err(|_| "document unavailable")?;
    if !file.starts_with(&root) || !file.is_file() { return Err("outside allowed directory".into()); }
    let mut bytes=Vec::new();
    fs::File::open(file).map_err(|_| "read failed")?.take(65_537).read_to_end(&mut bytes).map_err(|_| "read failed")?;
    if bytes.len()>65_536 { return Err("document too large".into()); }
    String::from_utf8(bytes).map_err(|_| "document is not UTF-8".into())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{path::PathBuf, sync::atomic::{AtomicUsize, Ordering}};
    static NEXT: AtomicUsize = AtomicUsize::new(0);
    struct Fixture(PathBuf);
    impl Fixture {
        fn new() -> Self {
            let base = std::env::temp_dir().join(format!("craft-command-{}-{}", std::process::id(), NEXT.fetch_add(1, Ordering::Relaxed)));
            fs::create_dir_all(base.join("allowed")).unwrap();
            fs::write(base.join("allowed/hello.txt"), "hello").unwrap();
            fs::write(base.join("private.txt"), "outside").unwrap();
            Self(base)
        }
        fn read(&self, name: &str) -> Result<String, String> {
            let root=self.0.join("allowed");
            if cfg!(feature="defective") { read_document_defective(&root,name) } else { read_document(&root,name) }
        }
    }
    impl Drop for Fixture { fn drop(&mut self) { fs::remove_dir_all(&self.0).unwrap(); } }
    #[test] fn reads_allowed_document() { let f=Fixture::new();assert_eq!(f.read("hello.txt").unwrap(),"hello"); }
    #[test] fn rejects_traversal() { let f=Fixture::new();assert!(f.read("../private.txt").is_err(),"outside allowed directory must be rejected"); }
    #[test] fn rejects_absolute_path() { let f=Fixture::new();assert!(f.read(f.0.join("private.txt").to_str().unwrap()).is_err()); }
    #[cfg(unix)]
    #[test] fn rejects_symlink_escape() { let f=Fixture::new();std::os::unix::fs::symlink(f.0.join("private.txt"),f.0.join("allowed/link.txt")).unwrap();assert!(f.read("link.txt").is_err()); }
}
