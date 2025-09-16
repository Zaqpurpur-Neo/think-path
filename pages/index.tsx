'use client'

import { useState, useEffect } from 'react'
import styles from '@/styles/LandingPage.module.css'

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const features = [
    {
      title: "Dekomposisi",
      description: "Memecah masalah kompleks menjadi bagian-bagian yang lebih sederhana dan mudah dipahami",
      icon: "🧩"
    },
    {
      title: "Pengenalan Pola", 
      description: "Mengidentifikasi pola dan kesamaan dalam berbagai situasi untuk menemukan solusi",
      icon: "🔍"
    },
    {
      title: "Abstraksi",
      description: "Fokus pada hal-hal penting sambil mengabaikan detail yang tidak relevan",
      icon: "🎯"
    },
    {
      title: "Algoritma",
      description: "Membuat langkah-langkah sistematis dan terstruktur untuk menyelesaikan masalah",
      icon: "⚡"
    }
  ]

  

  const stats = [
    { number: "Artificial Intelegent", label: "Artificial Intelegent untuk membantu anda lebih mudah mempelajari computational thinking" },
    { number: "Modul ", label: "Modul 4 pilar computational thinking yang disertai gambar agar kamu mudah paham" },
    { number: "Kuis", label: "Kuis-kuis di akhir modul dan kuis keseluruhan materi" },
    { number: "Coming Soon", label: "Akses Pembelajaran" }
  ]

  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.floatingShapes}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={`${styles.shape} ${styles[`shape${i + 1}`]}`}
              style={{
                transform: `translateY(${scrollY * 0.1 * (i + 1)}px)`
              }}
            ></div>
          ))}
        </div>
        <div className={styles.gridPattern}></div>
      </div>

      {/* Mouse Follower */}
      <div 
        className={styles.mouseFollower}
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10
        }}
      ></div>

      {/* Header */}
      <header className={styles.header}>
        <nav className={`${styles.nav} ${isLoaded ? styles.slideDown : ''}`}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <div className={styles.logoSquare}></div>
              <div className={styles.logoSquare}></div>
              <div className={styles.logoSquare}></div>
              <div className={styles.logoSquare}></div>
            </div>
            <span className={styles.logoText}>ThinkPath</span>
          </div>
          <ul className={styles.navList}>
            <li><a href="/login" className={styles.navLink}>Log in</a></li>
            <li><a href="/register" className={styles.navLink}>Sign in</a></li>
          </ul>
          <button className={styles.menuToggle}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero} id="home">
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={`${styles.heroText} ${isLoaded ? styles.fadeInUp : ''}`}>
              <h1 className={styles.heroTitle}>
                <span className={styles.titleLine1}>Kembangkan</span>
                <span className={styles.titleLine2}>Computational</span>
                <span className={styles.titleAccent}>Thinking</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Platform pembelajaran interaktif yang membantu Anda memahami dan menguasai 
                konsep computational thinking melalui pendekatan yang menyenangkan dan praktis.
              </p>
              <div className={styles.heroButtons}>
                <button className={styles.btnPrimary}>
                  <span>Mulai Belajar</span>
                  <div className={styles.btnRipple}></div>
                </button>
          
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={`${styles.codeDemo} ${isLoaded ? styles.slideInRight : ''}`}>
              <div className={styles.codeWindow}>
                <div className={styles.codeHeader}>
                  <div className={styles.windowControls}>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                  </div>
                  <span className={styles.fileName}>computational_thinking</span>
                </div>
                <div className={styles.codeContent}>
                  <div className={styles.codeLine}>
                    <span className={styles.lineNumber}>1</span>
                    <span className={styles.codeText}>
                      <span className={styles.keyword}>def</span>{' '}
                      <span className={styles.function}>solve_problem</span>
                      <span className={styles.bracket}>(</span>
                      <span className={styles.parameter}>problem</span>
                      <span className={styles.bracket}>):</span>
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.lineNumber}>2</span>
                    <span className={styles.codeText}>
                      <span className={styles.indent}>    </span>
                      <span className={styles.comment}># Decomposition</span>
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.lineNumber}>3</span>
                    <span className={styles.codeText}>
                      <span className={styles.indent}>    </span>
                      <span className={styles.variable}>steps</span>{' '}
                      <span className={styles.operator}>=</span>{' '}
                      <span className={styles.function}>break_down</span>
                      <span className={styles.bracket}>(</span>
                      <span className={styles.parameter}>problem</span>
                      <span className={styles.bracket}>)</span>
                    </span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.lineNumber}>4</span>
                    <span className={styles.codeText}>
                      <span className={styles.indent}>    </span>
                      <span className={styles.keyword}>return</span>{' '}
                      <span className={styles.function}>execute</span>
                      <span className={styles.bracket}>(</span>
                      <span className={styles.variable}>steps</span>
                      <span className={styles.bracket}>)</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className={styles.floatingElements}>
                <div className={styles.floatingElement} style={{ top: '60%', left: '-10%' }}>
                  <span>💡</span>
                </div>
                <div className={styles.floatingElement} style={{ top: '80%', left: '85%' }}>
                  <span>🎯</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollWheel}></div>
          <span>Scroll untuk melihat lebih lanjut</span>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Empat Pilar <span className={styles.accent}>Computational Thinking</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Pelajari konsep fundamental yang membentuk dasar pemikiran komputasional
            </p>
          </div>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`${styles.featureCard} ${isLoaded ? styles.fadeInScale : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</div>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <div className={styles.cardGlow}></div>
                <button className={styles.learnMore}>
                 <a href="/register"><span>Pelajari</span></a> 
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className={styles.stats}>
        <div className={styles.sectionContainer}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statLine}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.sectionContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Siap Memulai Perjalanan <span className={styles.accent}>Pembelajaran</span> Anda?
            </h2>
            <p className={styles.ctaDescription}>
              Bergabunglah dengan ribuan siswa dan mulai kembangkan kemampuan computational thinking Anda hari ini
            </p>
            <div className={styles.ctaButtons}>
              <a href="/register">
              <button className={styles.ctaButton}>
                <span>Daftar Gratis</span>
                <div className={styles.buttonShine}></div>
              </button>
              </a>              
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.sectionContainer}>
          <div className={styles.footerContent}>
            <div className={styles.footerTop}>
              <div className={styles.footerBrand}>
                <div className={styles.logo}>
                  <div className={styles.logoIcon}>
                    <div className={styles.logoSquare}></div>
                    <div className={styles.logoSquare}></div>
                    <div className={styles.logoSquare}></div>
                    <div className={styles.logoSquare}></div>
                  </div>
                  <span className={styles.logoText}>ThinkPath</span>
                </div>
                <p className={styles.footerTagline}>
                  Mengembangkan pemikiran komputasional untuk masa depan yang lebih cerdas
                </p>
              </div>
              
              <div className={styles.footerLinks}>
                <div className={styles.linkGroup}>
                  <h4>Pembelajaran</h4>
                  <a href="#">Modul</a>
                  <a href="#">Tutorial</a>
                  <a href="#">Latihan</a>
                </div>
                <div className={styles.linkGroup}>
                  <h4>Dukungan</h4>
                  <a href="#">Bantuan</a>
                  <a href="#">Kontak</a>
                  <a href="#">FAQ</a>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </footer>
    </div>
  )
}