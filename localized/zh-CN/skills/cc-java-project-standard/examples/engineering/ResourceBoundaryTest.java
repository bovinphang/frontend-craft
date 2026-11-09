import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;

public final class ResourceBoundaryTest {
  private static int passed;
  private static int failed;
  @FunctionalInterface private interface Checked { void run() throws Exception; }
  private static void require(boolean condition, String message) {
    if (!condition) throw new AssertionError(message); // Always active, with or without -ea.
  }
  private static void run(String name, Checked body) {
    try {
      body.run(); passed++;
      System.out.println("CRAFT_TEST {\"name\":\"" + name + "\",\"status\":\"pass\"}");
    } catch (Exception | AssertionError error) {
      failed++;
      System.err.println("CRAFT_ASSERTION: " + error);
      System.out.println("CRAFT_TEST {\"name\":\"" + name + "\",\"status\":\"fail\"}");
    }
  }
  public static void main(String[] args) {
    run("failure_closes_and_preserves_cause", () -> {
      AtomicInteger closes = new AtomicInteger();
      try {
        ResourceBoundary.open(true, closes::incrementAndGet);
        throw new AssertionError("expected initialization failure");
      } catch (ResourceBoundary.BoundaryFailure error) {
        require(error.getCause() instanceof IOException, "EP-JAVA-01 original I/O cause required");
        require("payload unavailable".equals(error.getCause().getMessage()), "EP-JAVA-01 cause message required");
        require(closes.get() == 1, "EP-JAVA-01 acquired lease must close once");
      }
    });
    run("success_closes_once", () -> {
      AtomicInteger closes = new AtomicInteger();
      ResourceBoundary.open(false, closes::incrementAndGet);
      require(closes.get() == 1, "EP-JAVA-01 successful lease closes once");
    });
    System.out.println("CRAFT_SUMMARY {\"total\":2,\"passed\":"+passed+",\"failed\":"+failed+",\"skipped\":0}");
    if (failed != 0) System.exit(1);
  }
}
