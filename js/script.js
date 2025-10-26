// Global Institute of Education - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Always scroll to home on page load/refresh
    window.scrollTo(0, 0);
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollRevealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Add scroll reveal animations
    document.querySelectorAll('.fact-card, .course-card, .faculty-card, .facility-card, .activity-card, .section-title').forEach(el => {
        el.classList.add('scroll-reveal');
        scrollRevealObserver.observe(el);
    });

    // Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    // Trigger counter animation when in view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    });

    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        counterObserver.observe(aboutSection);
    }

    // Add float animation to course icons
    document.querySelectorAll('.course-icon').forEach(icon => {
        icon.classList.add('float-animation');
    });

    // Add pulse animation to buttons on hover
    document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.classList.add('pulse-animation');
        });
        btn.addEventListener('mouseleave', function() {
            this.classList.remove('pulse-animation');
        });
    });

    // Course modal functionality
    const courseModal = document.getElementById('courseModal');
    const courseModalTitle = document.getElementById('courseModalTitle');
    const courseModalBody = document.getElementById('courseModalBody');

    const courseData = {
        cse: {
            title: 'Computer Science Engineering',
            duration: '4 Years',
            degree: 'B.Tech',
            description: 'Our Computer Science Engineering program is designed to provide comprehensive knowledge in software development, artificial intelligence, machine learning, and emerging technologies.',
            curriculum: [
                'Programming Fundamentals',
                'Data Structures & Algorithms',
                'Database Management Systems',
                'Software Engineering',
                'Artificial Intelligence',
                'Machine Learning',
                'Web Development',
                'Mobile App Development'
            ],
            career: 'Software Developer, Data Scientist, AI Engineer, Full Stack Developer, System Analyst'
        },
        mech: {
            title: 'Mechanical Engineering',
            duration: '4 Years',
            degree: 'B.Tech',
            description: 'Comprehensive mechanical engineering program focusing on design, manufacturing, thermal systems, and modern manufacturing technologies.',
            curriculum: [
                'Engineering Mechanics',
                'Thermodynamics',
                'Fluid Mechanics',
                'Machine Design',
                'Manufacturing Processes',
                'CAD/CAM',
                'Robotics',
                'Automotive Engineering'
            ],
            career: 'Design Engineer, Manufacturing Engineer, Automotive Engineer, Project Manager, R&D Engineer'
        },
        eee: {
            title: 'Electrical Engineering',
            duration: '4 Years',
            degree: 'B.Tech',
            description: 'Electrical engineering program covering power systems, electronics, control systems, and renewable energy technologies.',
            curriculum: [
                'Circuit Analysis',
                'Power Systems',
                'Control Systems',
                'Electronics',
                'Digital Signal Processing',
                'Renewable Energy',
                'Power Electronics',
                'Electrical Machines'
            ],
            career: 'Electrical Engineer, Power Systems Engineer, Control Systems Engineer, Electronics Engineer'
        },
        civil: {
            title: 'Civil Engineering',
            duration: '4 Years',
            degree: 'B.Tech',
            description: 'Civil engineering program focusing on infrastructure development, construction management, and sustainable design practices.',
            curriculum: [
                'Structural Engineering',
                'Geotechnical Engineering',
                'Transportation Engineering',
                'Environmental Engineering',
                'Construction Management',
                'Building Information Modeling',
                'Sustainable Design',
                'Project Planning'
            ],
            career: 'Structural Engineer, Construction Manager, Project Engineer, Urban Planner, Infrastructure Consultant'
        },
        mba: {
            title: 'Master of Business Administration',
            duration: '2 Years',
            degree: 'MBA',
            description: 'Comprehensive MBA program designed to develop strategic thinking, leadership skills, and business acumen for modern management challenges.',
            curriculum: [
                'Strategic Management',
                'Financial Management',
                'Marketing Management',
                'Human Resource Management',
                'Operations Management',
                'Business Analytics',
                'Entrepreneurship',
                'Digital Marketing'
            ],
            career: 'Business Manager, Marketing Manager, Financial Analyst, HR Manager, Business Consultant'
        },
        science: {
            title: 'Applied Sciences',
            duration: '3 Years',
            degree: 'B.Sc',
            description: 'Applied sciences program providing strong foundation in physics, chemistry, and mathematics with research opportunities.',
            curriculum: [
                'Advanced Physics',
                'Organic Chemistry',
                'Mathematical Analysis',
                'Research Methodology',
                'Laboratory Techniques',
                'Scientific Computing',
                'Data Analysis',
                'Project Work'
            ],
            career: 'Research Scientist, Laboratory Analyst, Quality Control Specialist, Academic Researcher, Technical Writer'
        }
    };

    document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target="#courseModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const courseKey = this.getAttribute('data-course');
            const course = courseData[courseKey];
            
            if (course) {
                courseModalTitle.textContent = course.title;
                courseModalBody.innerHTML = `
                    <div class="row">
                        <div class="col-md-8">
                            <h6>Program Overview</h6>
                            <p>${course.description}</p>
                            
                            <h6 class="mt-4">Curriculum Highlights</h6>
                            <ul class="list-unstyled">
                                ${course.curriculum.map(item => `<li><i class="fas fa-check text-primary me-2"></i>${item}</li>`).join('')}
                            </ul>
                            
                            <h6 class="mt-4">Career Opportunities</h6>
                            <p>${course.career}</p>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h6>Program Details</h6>
                                    <p><strong>Duration:</strong> ${course.duration}</p>
                                    <p><strong>Degree:</strong> ${course.degree}</p>
                                    <p><strong>Mode:</strong> Full Time</p>
                                    <p><strong>Intake:</strong> July & January</p>
                                    <button class="btn btn-primary btn-sm w-100">Apply Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
    });

    // Facility modal functionality
    const facilityModal = document.getElementById('facilityModal');
    const facilityModalTitle = document.getElementById('facilityModalTitle');
    const facilityModalBody = document.getElementById('facilityModalBody');

    const facilityData = {
        'computer-lab': {
            title: 'Computer Lab',
            description: 'State-of-the-art computer laboratory equipped with latest hardware and software for comprehensive learning experience.',
            features: [
                'Latest generation computers with high-speed processors',
                'Licensed software including development tools and design applications',
                'High-speed internet connectivity',
                '24/7 access for students',
                'Air-conditioned environment',
                'Backup power supply'
            ],
            image: 'images/computer.png'
        },
        'library': {
            title: 'Central Library',
            description: 'Extensive library with vast collection of books, journals, and digital resources to support academic and research activities.',
            features: [
                'Over 50,000 books and journals',
                'Digital library with e-books and online databases',
                'Quiet study areas and group discussion rooms',
                'Research assistance and reference services',
                'Extended hours during exams',
                'Modern cataloging and search systems'
            ],
            image: 'images/library.png'
        },
        'hostel': {
            title: 'Student Hostel',
            description: 'Comfortable and secure accommodation facilities with modern amenities for outstation students.',
            features: [
                'Separate hostels for boys and girls',
                'Furnished rooms with study tables',
                'Common areas for recreation',
                'Mess facility with nutritious meals',
                '24/7 security and warden supervision',
                'Wi-Fi connectivity throughout'
            ],
            image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop'
        },
        'sports': {
            title: 'Sports Complex',
            description: 'Comprehensive sports facilities to promote physical fitness and recreational activities among students.',
            features: [
                'Multi-purpose indoor gymnasium',
                'Outdoor courts for basketball, volleyball, and tennis',
                'Football and cricket grounds',
                'Swimming pool with trained lifeguards',
                'Fitness center with modern equipment',
                'Sports equipment lending facility'
            ],
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
        },
        'cafeteria': {
            title: 'Cafeteria',
            description: 'Hygienic food court offering variety of cuisines and refreshments in a comfortable dining environment.',
            features: [
                'Multiple cuisine options',
                'Hygienic food preparation',
                'Affordable pricing for students',
                'Comfortable seating arrangements',
                'Extended operating hours',
                'Special dietary options available'
            ],
            image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop'
        },
        'auditorium': {
            title: 'Auditorium',
            description: 'Modern auditorium facility for hosting events, seminars, cultural programs, and academic conferences.',
            features: [
                'Seating capacity of 500 people',
                'Advanced audio-visual systems',
                'Stage with professional lighting',
                'Air-conditioned environment',
                'Wheelchair accessible',
                'Recording and live streaming capabilities'
            ],
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'
        }
    };

    document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target="#facilityModal"]').forEach(card => {
        card.addEventListener('click', function() {
            const facilityKey = this.getAttribute('data-facility');
            const facility = facilityData[facilityKey];
            
            if (facility) {
                facilityModalTitle.textContent = facility.title;
                facilityModalBody.innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${facility.image}" alt="${facility.title}" class="img-fluid rounded mb-3">
                        </div>
                        <div class="col-md-6">
                            <p>${facility.description}</p>
                            <h6>Key Features:</h6>
                            <ul class="list-unstyled">
                                ${facility.features.map(feature => `<li><i class="fas fa-check text-primary me-2"></i>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            }
        });
    });

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Campus Life carousel auto-play
    const campusLifeCarousel = document.getElementById('campusLifeCarousel');
    if (campusLifeCarousel) {
        const campusCarousel = new bootstrap.Carousel(campusLifeCarousel, {
            interval: 4000,
            wrap: true,
            pause: 'hover'
        });
        
        // Add fade animation between slides
        campusLifeCarousel.addEventListener('slide.bs.carousel', function (e) {
            const activeSlide = e.target.querySelector('.carousel-item.active .campus-overlay');
            const nextSlide = e.relatedTarget.querySelector('.campus-overlay');
            
            if (activeSlide) {
                activeSlide.style.opacity = '0';
                activeSlide.style.transform = 'translateY(20px)';
            }
        });
        
        campusLifeCarousel.addEventListener('slid.bs.carousel', function (e) {
            const currentSlide = e.target.querySelector('.carousel-item.active .campus-overlay');
            
            if (currentSlide) {
                setTimeout(() => {
                    currentSlide.style.opacity = '1';
                    currentSlide.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }

    // Testimonial carousel auto-play
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
        const carousel = new bootstrap.Carousel(testimonialCarousel, {
            interval: 5000,
            wrap: true
        });
    }

    // Floating action buttons animation
    const fabButtons = document.querySelectorAll('.fab-btn');
    fabButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Performance optimization: Debounced scroll handler
    let scrollTimeout;
    function debounceScroll(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(scrollTimeout);
                func(...args);
            };
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(later, wait);
        };
    }

    // Enhanced button interactions
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Preloader (if needed)
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});

// Utility functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top functionality
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(45deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
`;

document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', scrollToTop);

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

// Console welcome message
console.log('%c🎓 Global Institute of Education', 'color: #007bff; font-size: 20px; font-weight: bold;');
console.log('%cWebsite loaded successfully! 🚀', 'color: #28a745; font-size: 14px;');


const images = [
  "images/a.jpg",
  "images/b.jpg",
  "images/c.jpg",
  "images/d.jpg"
];

// let index = 0;
// const hero = document.querySelector(".hero-section");

// function changeBackground() {
//   hero.style.backgroundImage = `url(${images[index]})`;
//   index = (index + 1) % images.length;
// }

// changeBackground();
// setInterval(changeBackground, 4000);



// const images = [
//   "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1920&q=80",
//   "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
//   "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80"
// ];

const slidesContainer = document.querySelector(".hero-slides");

// Create slide divs
images.forEach((img, i) => {
  const div = document.createElement("div");
  div.classList.add("hero-slide");
  if(i === 0) div.classList.add("active"); // first slide visible
  div.style.backgroundImage = `url(${img})`;
  slidesContainer.appendChild(div);
});

let current = 0;
const slides = document.querySelectorAll(".hero-slide");

function nextSlide() {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");
}

// Change slide every 4 seconds
setInterval(nextSlide, 4000);
