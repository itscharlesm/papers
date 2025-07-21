let highestZ = 1;
let currentIndex = 0;

const paperElements = Array.from(document.querySelectorAll('.paper'));

// Hide all papers except the first
paperElements.forEach((paper, index) => {
    if (index !== 0) {
        paper.style.display = 'none';
    } else {
        // Add typewriter animation to first paper's paragraphs
        paper.querySelectorAll('p').forEach(p => p.classList.add('animate-type'));
    }
});

class Paper {
    constructor(paper, index) {
        this.paper = paper;
        this.index = index;
        this.holdingPaper = false;
        this.hasMoved = false;
        this.mouseTouchX = 0;
        this.mouseTouchY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.velX = 0;
        this.velY = 0;
        this.rotation = Math.random() * 30 - 15;
        this.currentPaperX = 0;
        this.currentPaperY = 0;
        this.rotating = false;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            if (!this.rotating) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.velX = this.mouseX - this.prevMouseX;
                this.velY = this.mouseY - this.prevMouseY;
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                    this.hasMoved = true;
                }

                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;

                this.paper.style.transform =
                    `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        });

        this.paper.addEventListener('mousedown', (e) => {
            if (this.holdingPaper) return;

            this.holdingPaper = true;
            this.paper.style.zIndex = highestZ++;

            if (e.button === 0) {
                this.mouseTouchX = this.mouseX;
                this.mouseTouchY = this.mouseY;
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }

            if (e.button === 2) {
                this.rotating = true;
            }
        });

        window.addEventListener('mouseup', () => {
            if (this.holdingPaper && this.hasMoved && this.index === currentIndex) {
                currentIndex++;

                const next = paperElements[currentIndex];
                if (next) {
                    next.style.display = 'block';

                    // Trigger typewriter animation on next paper
                    next.querySelectorAll('p').forEach(p => {
                        p.classList.remove('animate-type');
                        void p.offsetWidth; // force reflow
                        p.classList.add('animate-type');
                    });
                }
            }

            this.holdingPaper = false;
            this.rotating = false;
        });
    }
}

paperElements.forEach((paper, index) => {
    new Paper(paper, index);
});
