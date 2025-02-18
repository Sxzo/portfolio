import { FaGithub, FaLinkedin, FaEnvelope, FaMoon, FaSun, FaUser, FaGraduationCap, FaBriefcase, FaRocket, FaPaperPlane } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import './App.css'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface WorkExperience {
  title: string;
  company: string;
  period: string;
  description: string[];
  logo: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  sourceLink?: string;
  demoLink?: string;
}

interface Quote {
  text: string;
  author: string;
}

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentQuote, setCurrentQuote] = useState<Quote>({ text: '', author: '' });

  // Add your quotes here
  const quotes: Quote[] = [
    {
      text: "The best way to predict the future is to invent it.",
      author: "Alan Kay"
    },
    {
      text: "Studying without thinking is useless. Thinking without studying, is perilous.",
      author: "Confucius"
    },
    {
      text: "The difference between theory and practice is that in theory, there is no difference between theory and practice",
      author: "Richard Moore"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "The most powerful technologies are the ones that empower others.",
      author: "Jensen Huang"
    },
    {
      text: "The trick is not to fool yourself, and you're the easiest person to fool.",
      author: "Richard Feynman"
    },
    {
      text: "A person who never made a mistake never tried anything new.",
      author: "Albert Einstein"
    }
    // Add more quotes as needed
  ];

  useEffect(() => {
    // Update quote every 10 seconds
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    };

    getRandomQuote();
    const interval = setInterval(getRandomQuote, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!darkMode) {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
    }
  }, [darkMode]);

  const experiences: WorkExperience[] = [
    {
      title: "Fundamentals Modeling & Innovation Intern",
      company: "British Petroleum (BP) Inc.",
      period: "June 2023 - August 2023",
      logo: "/company1-logo.png",
      description: [
        "Developed robust and scalable Python data pipelines to automate data ingestion, transformation, and processing for advanced ML models, improving data accessibility and reducing processing times by up to 40%",
        "Refactored legacy models using Python and Dataiku, achieving a 50% boost in computational efficiency and facilitating smoother integration with new datasets",
        "Engineered high performance data validation and backtesting processes, automating workflows and reducing manual effort for a team of six, significantly enhancing productivity and accuracy in historical assessments"
      ]
    },
    {
      title: "ExitPath Lead Engineer",
      company: "Hard Fork (VC)",
      period: "September 2024 - Present",
      logo: "/company4-logo.png",
      description: [
        "Researching and protyping an AI-powered analysis tool to help founders and investors make data-driven decisions",
        "More coming soon..."
      ]
    },
    {
      title: "Software Engineer & Product Lead ",
      company: "DuelDog",
      period: "May 2023 - March 2024",
      logo: "/company3-logo.png",
      description: [
        "Led a team of cross-functional engineers to redesign and optimize the site architecture, transforming the legacy .NET framework into a cloud based platform built on AWS, improving scalability and operational efficiency",
        "Developed and optimized key product features by implementing RESTful APIs and various critical microservices, reducing load times by 30% and enhancing real-time data synchronization across the platform",
        "Drove strategic discussions in weekly executive meetings, delivering data-driven insights and performance metrics to influence product direction and align development efforts with high-level business objectives"
      ]
    },
    {
      title: "Intro to C++ Teaching Assistant (CS 128)",
      company: "University of Illinois",
      period: "May 2022 - August 2022",
      logo: "/company2-logo.png",
      description: [
        "Guided 115+ students mastering C++ by providing targeted support, tutoring, and code reviews, helping students overcome project challenges and boosting overall engagement and success in CS 128",
        "Strengthened software engineering and debugging skills through hands-on troubleshooting of over 200 projects",
        "Assist students with debugging and understanding core C++ concepts"
      ]
    }
  ];

  const projects: Project[] = [
    {
      title: "Live AI Powered Trading Bot",
      description: "Spent 300+ hours building a live AI powered trading bot that converted natural language ideas from Discord into working trades using ChatGPT and $2,000 in capital",
      technologies: ["React", "TypeScript","AWS", "Python", "ChatGPT", "EC2", "Discord API"],
      image: "/project1.png",
      demoLink: "https://message.style/cdn/images/b3ca0ea985a6d5c0284408f7a28eb09a2978ad0242b104bd687653672a24e054.png"
    },
    {
      title: "Handtracking Color Match",
      description: "Used a hand tracking neural network model to create an interactive color matching game",
      technologies: ["Python", "OpenCV", "TensorFlow", "PyGame"],
      image: "/project2.gif",
      sourceLink: "https://github.com/Sxzo/Handtracking-Colormatch"
    },
    {
      title: "Full Home IoT Dashboard",
      description: "Built a platform that enabled real-time monitoring and control of smart home devices, including lights, cameras, and even my car!",
      technologies: ["Python", "Flask", "React", "MongoDB", "AWS", "JavaScript"],
      image: "/project3.jpg"
    },
    {
      title: "Wikipedia Connectivity Visualizer",
      description: "Used advanced graph algorithms to visualize the connectivity of Wikipedia pages, allowing users to explore the relationships between different topics and concepts",
      technologies: ["C++", "Graph Algorithms", "Data Structures"],
      image: "/project4.gif",
      sourceLink: "https://github.com/jmorrissey23/Wikipedia-Analysis?tab=readme-ov-file",
      demoLink: "https://github.com/joetamulaitis/cryptic/blob/main/documents/results.md"
    },
    {
      title: "Exam Grade Calculator",
      description: "Created a modern and responsive interface for calculating exam grades based on the percentage of the total points earned",
      technologies: ["React", "CSS", "JavaScript"],
      image: "/project5.png",
      sourceLink: "https://github.com/Sxzo/Exam-Grade-Calculator",
      demoLink: "https://sxzo.github.io/Exam-Grade-Calculator/"
    },
    {
      title: "Self Driving Car Simulator",
      description: "Built a functional naive self driving car algorithm implemented using a Raspberry Pi and a Raspberry Pi Camera",
      technologies: ["Arduino", "Python", "OpenCV", "Raspberry Pi"],
      image: "/project6.gif"
    },
    {
      title: "Govee Smart Lights Python Library",
      description: "Created a Python library to control Govee smart lights, allowing users to easily set colors, brightness, and other lighting effects",
      technologies: ["Python", "Flask"],
      image: "/project7.jpg",
      sourceLink: "https://github.com/Sxzo/Govee-Python-Library"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const projectSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '15%',
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    swipeToSlide: true,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          centerPadding: '10%',
        }
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: '0',
          centerMode: false,
        }
      }
    ]
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-links">
          <button onClick={() => scrollToSection('about')}>About</button>
          <button onClick={() => scrollToSection('education')}>Education</button>
          <button onClick={() => scrollToSection('experience')}>Experience</button>
          <button onClick={() => scrollToSection('projects')}>Projects</button>
          <button onClick={() => scrollToSection('contact')}>Contact</button>
        </div>
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? 
            <FaSun style={{ color: '#FFD700' }} /> : 
            <FaMoon style={{ color: '#7982B9' }} />
          }
        </button>
      </nav>

      <header>
        <div className="profile-section">
          <img 
            src="/profile-picture.png" 
            alt="Profile Picture" 
            className="profile-picture"
          />
          <h1>Lev Sosani <span className="wave">👋</span></h1>
          <h2>Computer Science & Economics @ UIUC</h2>
        </div>
        <div className="social-links">
          <a href="https://github.com/Sxzo" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/lev-sosani/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="mailto:sosanilev10@gmail.com">
            <FaEnvelope />
          </a>
        </div>
        <div className="quote-box">
          <p>"{currentQuote.text}"</p>
          <p className="quote-author">- {currentQuote.author}</p>
        </div>
      </header>

      <div className="separator"></div>

      <section id="about" className="about">
        <h2><FaUser className="section-icon" /> About Me</h2>
        <p>
          I'm a Computer Science and Economics student at the University of Illinois at Urbana-Champaign, with a strong passion for financial markets and AI. I love building projects that make the world a better place. 
          I have a strong interest in the intersection of technology and finance, and I'm always looking for new ways to apply my skills to real-world problems. I plan on starting my full-time career at BP after graduation.
        </p>
      </section>

      <section id="education" className="education">
        <h2><FaGraduationCap className="section-icon" /> Education</h2>
        <div className="education-container">
          <div className="education-info">
            <h3>University of Illinois at Urbana-Champaign</h3>
            <p className="degree">Bachelor of Science</p>
            <p className="majors">Computer Science and Economics</p>
            <p className="period">Expected Graduation: May 2025</p>
            <p className="gpa">GPA: 3.98/4.00</p>
          </div>
          <div className="education-image">
            <img src="/uiuc-campus.jpg" alt="UIUC Campus" />
          </div>
        </div>
      </section>

      <section id="experience" className="experience">
        <h2><FaBriefcase className="section-icon" /> Work Experience</h2>
        <Slider {...projectSliderSettings}>
          {experiences.map((exp, index) => (
            <div key={index}>
              <div className="experience-card">
                <div className="company-logo">
                  <img src={exp.logo} alt={`${exp.company} logo`} />
                </div>
                <div className="experience-content">
                  <div className="experience-info">
                    <h3 className="experience-title">{exp.title}</h3>
                    <h4 className="company-name">{exp.company}</h4>
                    <p className="period">{exp.period}</p>
                  </div>
                  <ul>
                    {exp.description.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <section id="projects" className="projects">
        <h2><FaRocket className="section-icon" /> Projects</h2>
        <Slider {...projectSliderSettings}>
          {projects.map((project, index) => (
            <div key={index}>
              <div className="project-card">
                <div className="project-content">
                  <div className="project-image">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className={project.title === "Handtracking Color Match" ? "handtracking" : ""}
                    />
                  </div>
                  <div className="project-info">
                    <h3 className="project-title">{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="technologies">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      {project.demoLink && (
                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link">
                          <FaRocket className="link-icon" /> View Project
                        </a>
                      )}
                      {project.sourceLink && (
                        <a href={project.sourceLink} target="_blank" rel="noopener noreferrer" className="project-link">
                          <FaGithub className="link-icon" /> View Source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <section id="contact" className="contact">
        <h2><FaPaperPlane className="section-icon" /> Contact Me</h2>
        <div className="contact-container">
          <div className="contact-content">
            <p>I'm always open to new opportunities and collaborations. Feel free to reach out!</p>
            <div className="contact-methods">
              <a href="mailto:sosanilev10@gmail.com" className="contact-method">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h3>Email</h3>
                  <p>sosanilev10@gmail.com</p>
                </div>
              </a>
              <a href="https://www.linkedin.com/in/lev-sosani/" target="_blank" rel="noopener noreferrer" className="contact-method">
                <FaLinkedin className="contact-icon" />
                <div>
                  <h3>LinkedIn</h3>
                  <p>Connect with me</p>
                </div>
              </a>
              <a href="https://github.com/Sxzo" target="_blank" rel="noopener noreferrer" className="contact-method">
                <FaGithub className="contact-icon" />
                <div>
                  <h3>GitHub</h3>
                  <p>Check out my code</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 Lev Sosani. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
