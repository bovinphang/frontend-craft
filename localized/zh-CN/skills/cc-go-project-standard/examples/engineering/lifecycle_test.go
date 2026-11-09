package pipeline

import (
	"context"
	"testing"
	"time"
)

func TestCancellationWaitsForBoth(t *testing.T) {
	p := NewPipeline(context.Background())
	<-p.entered // The worker owns a value; output deliberately has no receiver.
	done := make(chan struct{})
	go func() { p.Stop(); close(done) }()
	select {
	case <-done:
		if p.exited.Load() != 2 {
			t.Fatalf("EP-GO-01 expected both workers exited, got %d", p.exited.Load())
		}
	case <-time.After(5 * time.Second):
		t.Fatal("EP-GO-01 cancellation must unblock and finish both workers")
	}
}
