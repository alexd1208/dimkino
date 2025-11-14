// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeGift();
    initializeMusicPlayer();
});

// Навигация между секциями
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Убираем активный класс у всех ссылок и секций
            navLinks.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Добавляем активный класс текущей ссылке
            this.classList.add('active');
            
            // Показываем соответствующую секцию
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Инициализация функционала подарка
function initializeGift() {
    const giftButton = document.getElementById('openGift');
    const giftModal = document.getElementById('giftModal');
    const closeModal = document.querySelector('.close');
    const fireworksCanvas = document.getElementById('fireworksCanvas');
    
    giftButton.addEventListener('click', function() {
        // Показываем фейерверк
        fireworksCanvas.style.display = 'block';
        startFireworks();
        
        // Показываем модальное окно через 2 секунды
        setTimeout(() => {
            giftModal.style.display = 'block';
        }, 2000);
    });
    
    closeModal.addEventListener('click', function() {
        giftModal.style.display = 'none';
        fireworksCanvas.style.display = 'none';
        stopFireworks();
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === giftModal) {
            giftModal.style.display = 'none';
            fireworksCanvas.style.display = 'none';
            stopFireworks();
        }
    });
}

// Инициализация музыкального плеера
function initializeMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.classList.add('playing');
            musicToggle.textContent = '🔊';
        } else {
            backgroundMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.textContent = '🎵';
        }
    });
    
    // Автозапуск музыки (опционально)
    // backgroundMusic.play().catch(e => console.log('Автозапуск музыки заблокирован браузером'));
}

// Система фейерверка
let fireworks = [];
let animationId;
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.02;
    }
    
    update() {
        this.velocity.y += 0.05; // гравитация
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.5;
        this.speed = 5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.particles = [];
        this.exploded = false;
    }
    
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        } else {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }
    
    draw() {
        if (!this.exploded) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            this.particles.forEach(particle => particle.draw());
        }
    }
    
    explode() {
        this.exploded = true;
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }
}

function startFireworks() {
    fireworks = [];
    
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Создаем новые фейерверки
        if (Math.random() < 0.05) {
            fireworks.push(new Firework());
        }
        
        // Обновляем и рисуем фейерверки
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            
            // Удаляем отработанные фейерверки
            if (fireworks[i].exploded && fireworks[i].particles.length === 0) {
                fireworks.splice(i, 1);
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function stopFireworks() {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}