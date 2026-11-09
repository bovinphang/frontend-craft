package pipeline

import (
	"context"
	"os"
	"sync"
	"sync/atomic"
)

// Pipeline owns both workers. Its caller owns deciding when to stop.
type Pipeline struct {
	cancel  context.CancelFunc
	workers sync.WaitGroup
	entered chan struct{}
	output  chan int
	exited  atomic.Int32
}

func NewPipeline(parent context.Context) *Pipeline {
	ctx, cancel := context.WithCancel(parent)
	p := &Pipeline{cancel: cancel, entered: make(chan struct{}), output: make(chan int)}
	jobs := make(chan int)
	defective := os.Getenv("CRAFT_ENGINEERING_DEFECTIVE") == "1"
	p.workers.Add(2)
	go func() {
		defer p.workers.Done()
		defer p.exited.Add(1)
		for n := 1; ; n++ {
			if defective {
				jobs <- n
				continue
			} // Deliberately cannot observe cancellation while blocked.
			select {
			case <-ctx.Done():
				return
			case jobs <- n:
			}
		}
	}()
	go func() {
		defer p.workers.Done()
		defer p.exited.Add(1)
		var once sync.Once
		for {
			var value int
			if defective {
				value = <-jobs
			} else {
				select {
				case <-ctx.Done():
					return
				case value = <-jobs:
				}
			}
			once.Do(func() { close(p.entered) })
			if defective {
				p.output <- value
				continue
			}
			select {
			case <-ctx.Done():
				return
			case p.output <- value:
			}
		}
	}()
	return p
}

// Stop cancels and confirms termination, rather than merely signaling interest ended.
func (p *Pipeline) Stop() { p.cancel(); p.workers.Wait() }
