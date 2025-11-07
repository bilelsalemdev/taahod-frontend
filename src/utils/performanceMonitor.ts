import { PERFORMANCE_CONFIG } from '../config/animations';

/**
 * Performance Monitor for tracking FPS and managing animation queue
 */
class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private animationQueue: Set<string> = new Set();
  private isMonitoring = false;
  private rafId: number | null = null;

  /**
   * Start monitoring FPS
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.measureFPS();
  }

  /**
   * Stop monitoring FPS
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Measure FPS using requestAnimationFrame
   */
  private measureFPS = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    // Calculate FPS every second
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Log performance warnings in development
      if (import.meta.env.DEV && this.fps < PERFORMANCE_CONFIG.fpsThreshold) {
        console.warn(`Low FPS detected: ${this.fps} fps`);
      }
    }

    this.rafId = requestAnimationFrame(this.measureFPS);
  };

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return this.fps;
  }

  /**
   * Check if performance is good
   */
  isPerformanceGood(): boolean {
    return this.fps >= PERFORMANCE_CONFIG.fpsThreshold;
  }

  /**
   * Add animation to queue
   */
  addAnimation(id: string): boolean {
    // Check if we've reached the max concurrent animations
    if (this.animationQueue.size >= PERFORMANCE_CONFIG.maxConcurrentAnimations) {
      if (import.meta.env.DEV) {
        console.warn(`Max concurrent animations reached (${PERFORMANCE_CONFIG.maxConcurrentAnimations})`);
      }
      return false;
    }

    this.animationQueue.add(id);
    return true;
  }

  /**
   * Remove animation from queue
   */
  removeAnimation(id: string): void {
    this.animationQueue.delete(id);
  }

  /**
   * Get number of active animations
   */
  getActiveAnimationCount(): number {
    return this.animationQueue.size;
  }

  /**
   * Check if animation can be added
   */
  canAddAnimation(): boolean {
    return this.animationQueue.size < PERFORMANCE_CONFIG.maxConcurrentAnimations;
  }

  /**
   * Clear all animations from queue
   */
  clearAnimations(): void {
    this.animationQueue.clear();
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      fps: this.fps,
      activeAnimations: this.animationQueue.size,
      isPerformanceGood: this.isPerformanceGood(),
      canAddAnimation: this.canAddAnimation(),
    };
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring in browser environment
if (typeof window !== 'undefined') {
  performanceMonitor.startMonitoring();
}
