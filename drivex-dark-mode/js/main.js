(function () {
            "use strict";
            
            const list = document.querySelector(".HeaderTheme .picker-list");
            
            if (!list) return;
            
            const items = Array.from(
               list.querySelectorAll(".slideshow-item-a, .slideshow-item-b")
            );
            
            if (!items.length) return;
            
            const total = items.length;
            
            let activeIndex = 0;
            let position = 0;
            
            let itemHeight = 0;
            let isDragging = false;
            let startY = 0;
            let startPosition = 0;
            let pointerId = null;
            
            let autoTimer = null;
            let animationFrame = null;
            
            const AUTO_DELAY = 1300;
            const AUTO_DURATION = 650;
            const SNAP_DURATION = 420;
            const DRAG_SENSITIVITY = 1;
            
            function measure() {
               const firstItem = items[0];
               const itemRect = firstItem.getBoundingClientRect();
               
               itemHeight = itemRect.height || 198;
               
               render(position);
            }
            
            function normalizeIndex(index) {
               return ((index % total) + total) % total;
            }
            
            function stopAuto() {
               if (autoTimer) {
                  clearTimeout(autoTimer);
                  autoTimer = null;
               }
            }
            
            function stopAnimation() {
               if (animationFrame) {
                  cancelAnimationFrame(animationFrame);
                  animationFrame = null;
               }
            }
            
            function easeOutCubic(t) {
               return 1 - Math.pow(1 - t, 3);
            }
            
            function getCircularDiff(index, currentPosition) {
               let diff = index - currentPosition;
               
               while (diff > total / 2) {
                  diff -= total;
               }
               
               while (diff < -total / 2) {
                  diff += total;
               }
               
               return diff;
            }
            
            function render(currentPosition) {
               position = currentPosition;
               
               const translateY = -currentPosition * itemHeight;
               
               list.style.transform = `translate3d(0, ${translateY}px, 0)`;
               
               items.forEach((item, index) => {
                  const diff = getCircularDiff(index, currentPosition);
                  const absDiff = Math.abs(diff);
                  
                  item.style.height = `${itemHeight}px`; 
                  item.style.width = "100%";
                  item.style.display = "flex";
                  item.style.alignItems = "center";
                  item.style.justifyContent = "center";
                  item.style.overflow = "hidden";
                  
                  
                  if (diff < 0) {
                     item.style.transformOrigin = "50% 100%";
                  }
                  else {
                     item.style.transformOrigin = "50% 0%";
                  }
                  
                  item.style.transform = "none";
                  
                  if (absDiff < 0.6) {
                     item.style.opacity = "1";
                     item.style.visibility = "visible";
                  }
                  else if (absDiff < 1.6) {
                     item.style.opacity = "0.85";
                     item.style.visibility = "visible";
                  }
                  else {
                     item.style.opacity = "0";
                     item.style.visibility = "hidden";
                  }
                  
                  item.setAttribute("aria-hidden", absDiff < 0.6 ? "false" : "true");
               });
            }
            
            function animateTo(targetPosition, duration, callback) {
               stopAnimation();
               
               const from = position;
               const to = targetPosition;
               const startTime = performance.now();
               
               function tick(now) {
                  const elapsed = now - startTime;
                  const progress = Math.min(elapsed / duration, 1);
                  const eased = easeOutCubic(progress);
                  
                  const nextPosition = from + (to - from) * eased;
                  
                  render(nextPosition);
                  
                  if (progress < 1) {
                     animationFrame = requestAnimationFrame(tick);
                     return;
                  }
                  
                  animationFrame = null;
                  
                  activeIndex = normalizeIndex(Math.round(to));
                  position = activeIndex;
                  
                  render(position);
                  
                  if (typeof callback === "function") {
                     callback();
                  }
               }
               
               animationFrame = requestAnimationFrame(tick);
            }
            
            function startAuto() {
               stopAuto();
               
               autoTimer = setTimeout(function () {
                  if (isDragging) return;
                  
                  const next = activeIndex + 1;
                  
                  animateTo(next, AUTO_DURATION, function () {
                     activeIndex = normalizeIndex(Math.round(next));
                     position = activeIndex;
                     render(position);
                     startAuto();
                  });
               }, AUTO_DELAY);
            }
            
            function snapToNearest() {
               const nearest = Math.round(position);
               const snapped = normalizeIndex(nearest);
               
               animateTo(nearest, SNAP_DURATION, function () {
                  activeIndex = snapped;
                  position = snapped;
                  render(position);
                  startAuto();
               });
            }
            
            function onPointerDown(event) {
               if (event.button !== undefined && event.button !== 0) return;
               
               isDragging = true;
               pointerId = event.pointerId;
               startY = event.clientY;
               startPosition = position;
               
               list.classList.add("is-dragging");
               
               stopAuto();
               stopAnimation();
               
               if (list.setPointerCapture) {
                  list.setPointerCapture(event.pointerId);
               }
            }
            
            function onPointerMove(event) {
               if (!isDragging) return;
               if (pointerId !== event.pointerId) return;
               
               const deltaY = event.clientY - startY;
               const deltaPosition = -(deltaY * DRAG_SENSITIVITY) / itemHeight;
               
               render(startPosition + deltaPosition);
            }
            
            function onPointerUp(event) {
               if (!isDragging) return;
               if (pointerId !== event.pointerId) return;
               
               isDragging = false;
               pointerId = null;
               
               list.classList.remove("is-dragging");
               
               if (list.releasePointerCapture) {
                  try {
                     list.releasePointerCapture(event.pointerId);
                  }
                  catch (error) {}
               }
               
               snapToNearest();
            }
            
            function onPointerCancel(event) {
               if (!isDragging) return;
               if (pointerId !== event.pointerId) return;
               
               isDragging = false;
               pointerId = null;
               
               list.classList.remove("is-dragging");
               
               snapToNearest();
            }
            
            list.addEventListener("pointerdown", onPointerDown);
            list.addEventListener("pointermove", onPointerMove);
            list.addEventListener("pointerup", onPointerUp);
            list.addEventListener("pointercancel", onPointerCancel);
            
            window.addEventListener("resize", measure);
            
            measure();
            render(0);
            startAuto();
         })();
         
         
         const appearAnimations = {
            "header-Nav": {
               default: {
                  initial: {
                     opacity: 0.001,
                     rotate: 0,
                     scale: 1,
                     x: 0,
                     y: -48
                  },
                  animate: {
                     opacity: 1,
                     rotate: 0,
                     scale: 1,
                     x: 0,
                     y: 0,
                     transition: {
                        delay: 1,
                        duration: 1,
                        ease: [0.44, 0, 0.56, 1]
                     }
                  }
               }
            },
            
            "badge": {
               default: {
                  initial: {
                     opacity: 0.001,
                     rotate: 0,
                     scale: 1,
                     x: 0,
                     y: 0
                  },
                  animate: {
                     opacity: 1,
                     rotate: 0,
                     scale: 1,
                     x: 0,
                     y: 0,
                     transition: {
                        delay: 1,
                        duration: 1,
                        ease: [0.44, 0, 0.56, 1]
                     }
                  }
               }
            },
            
            "image-box": {
               default: {
                  initial: {
                     opacity: 0.001,
                     rotate: -13,
                     scale: 1,
                     x: -9,
                     y: -43
                  },
                  animate: {
                     opacity: 1,
                     rotate: -2,
                     scale: 1,
                     x: 0,
                     y: 0,
                     transition: {
                        delay: 0,
                        duration: 1,
                        ease: [0.44, 0, 0.56, 1]
                     }
                  }
               }
            },
            
            "logo-box": {
               default: {
                  initial: {
                     opacity: 0.001,
                     rotate: 6,
                     scale: 1,
                     x: 12,
                     y: -18
                  },
                  animate: {
                     opacity: 1,
                     rotate: 2,
                     scale: 1,
                     x: 0,
                     y: 0,
                     transition: {
                        delay: 0,
                        duration: 1,
                        ease: [0.44, 0, 0.56, 1]
                     }
                  }
               }
            },
            
            "subheading": {
               default: {
                  initial: {
                     opacity: 0.001,
                     rotate: 0,
                     scale: 1,
                     x: 0,
                     y: 0
                  },
                  animate: {
                     opacity: 1,
                     rotate: 0,
                     scale: 1,
                     x: 0,
                     y: 0,
                     transition: {
                        delay: 1,
                        duration: 1,
                        ease: [0.44, 0, 0.56, 1]
                     }
                  }
               }
            },
            
            "CTA": {
               default: {
                  initial: {
                     opacity: 0.001,
                     rotate: 0,
                     scale: 1,
                     x: 0,
                     y: 48
                  },
                  animate: {
                     opacity: 1,
                     rotate: 0,
                     scale: 1,
                     x: 0,
                     y: 0,
                     transition: {
                        delay: 1,
                        duration: 1,
                        ease: [0.44, 0, 0.56, 1]
                     }
                  }
               }
            }
            
         };
         

function toTransform(state = {}) {
    const x = state.x ?? 0;
    const y = state.y ?? 0;
    const rotate = state.rotate ?? 0;
    const scale = state.scale ?? 1;
    const skewX = state.skewX ?? 0;
    const skewY = state.skewY ?? 0;
    
    return `translate(${x}px, ${y}px) rotate(${rotate}deg) skew(${skewX}deg, ${skewY}deg) scale(${scale})`;
}

// Function to apply final CSS states
function applyFinalState(element, state = {}) {
    element.style.opacity = String(state.opacity ?? 1);
    element.style.transform = toTransform(state);
}

// Core animation player
function playAppearAnimation(element, config) {
    if (!element || !config) return;
    
    // Check if already played to prevent loops
    if (element.dataset.dxAnimPlayed === "true") return;
    element.dataset.dxAnimPlayed = "true";
    
    const initial = config.initial || {};
    const animate = config.animate || {};
    const transition = animate.transition || {};
    
    const duration = (transition.duration ?? 1) * 1000;
    const delay = (transition.delay ?? 0) * 1000;
    const easingArray = transition.ease || [0.44, 0, 0.56, 1];
    const easing = `cubic-bezier(${easingArray.join(",")})`;

    // Stop current animations before starting new one
    element.getAnimations().forEach((animation) => animation.cancel());

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) {
        applyFinalState(element, animate);
        return;
    }

    // Set hardware acceleration and initial state
    element.style.opacity = String(initial.opacity ?? 1);
    element.style.transform = toTransform(initial);
    element.style.willChange = "opacity, transform";

    const animation = element.animate(
        [
            { opacity: initial.opacity ?? 1, transform: toTransform(initial) },
            { opacity: animate.opacity ?? 1, transform: toTransform(animate) }
        ], 
        { duration, delay, easing, fill: "forwards" }
    );

    animation.addEventListener("finish", () => {
        applyFinalState(element, animate);
        element.style.willChange = "auto";
        animation.cancel();
    });
}

// Initialize all animations with dx-anim-id
function initDxAnimations() {
    // You can rename 'appearAnimations' to match your config object name
    const elements = document.querySelectorAll("[data-item-appear-id]");
    
    elements.forEach((element) => {
        const animId = element.getAttribute("data-item-appear-id");
        const config = typeof appearAnimations !== 'undefined' ? appearAnimations[animId] : null;
        
        if (config && config.default) {
            playAppearAnimation(element, config.default);
        }
    });
}

// Event Listeners
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDxAnimations, { once: true });
} else {
    initDxAnimations();
}

        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        let mx = 0, my = 0, rx = 0, ry = 0;
        
        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = (mx - 4) + 'px';
            dot.style.top = (my - 4) + 'px';
        });

        (function animRing() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = (rx - 18) + 'px';
            ring.style.top = (ry - 18) + 'px';
            requestAnimationFrame(animRing);
        })();

        document.querySelectorAll('a, button, .cursor-none, .magnetic').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
            });
        });

        gsap.to('#progress', {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });

   


