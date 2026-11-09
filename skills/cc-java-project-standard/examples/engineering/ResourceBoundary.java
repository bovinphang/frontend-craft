import java.io.IOException;

public final class ResourceBoundary {
  private ResourceBoundary() {}
  public static final class BoundaryFailure extends Exception {
    BoundaryFailure(IOException cause) { super("payload initialization failed", cause); }
  }
  private static final class Lease implements AutoCloseable {
    private final Runnable release;
    Lease(Runnable release) { this.release = release; }
    @Override public void close() { release.run(); }
  }
  public static void open(boolean fail, Runnable release) throws BoundaryFailure {
    Lease lease = new Lease(release);
    if ("1".equals(System.getenv("CRAFT_ENGINEERING_DEFECTIVE"))) {
      if (fail) throw new BoundaryFailure(new IOException("payload unavailable"));
      lease.close();
      return;
    }
    try (lease) {
      if (fail) throw new IOException("payload unavailable");
    } catch (IOException cause) {
      throw new BoundaryFailure(cause);
    }
  }
}
