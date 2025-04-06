import {
  LogInIcon,
  ChevronDownIcon,
  FileTextIcon,
  SearchIcon,
  ShieldIcon,
  BrainIcon,
} from "lucide-react";
import landing from "../assets/bg/test.jpg";
import icone1 from "../assets/icones/icone1.ico";
import icone2 from "../assets/icones/icone4.png";
import icone3 from "../assets/icones/icone5.png";
import logo from "../assets/icones/logo 3.jpg";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 5000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  const scrollToFeatures = () => {
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
    setShowScrollHint(false);
  };

  const features = [
    {
      icon: icone1,
      title: "Archivage Adaptatif",
      description:
        "Notre système organise vos documents selon vos priorités pour faciliter leur recherche et leur gestion.",
      color: "bg-blue-50 text-blue-700",
      iconComponent: <FileTextIcon className="w-6 h-6" />,
    },
    {
      icon: icone2,
      title: "Recherche Contextuelle",
      description:
        "Retrouvez instantanément vos documents grâce à notre moteur de recherche intelligent et performant.",
      color: "bg-purple-50 text-purple-700",
      iconComponent: <SearchIcon className="w-6 h-6" />,
    },
    {
      icon: icone3,
      title: "Sécurité Évolutive",
      description:
        "Protection de vos données qui respecte les normes les plus strictes en matière de confidentialité.",
      color: "bg-green-50 text-green-700",
      iconComponent: <ShieldIcon className="w-6 h-6" />,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white" ref={containerRef}>
      {/* Hero Section - Élégant et fixe */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url(${landing})`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/70"></div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center flex flex-col items-center justify-center w-full max-w-5xl z-10 p-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <img
              src={logo}
              className="rounded-full w-24 h-24 shadow-lg border-2 border-white/20 mx-auto"
              alt="Logo Digi-Doc"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">
              Digi-Doc
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mb-6"
          >
            Système intelligent de gestion d'archives pour entreprises
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-lg text-gray-300 max-w-2xl mb-10"
          >
            Organisez, recherchez et accédez à vos documents avec une interface
            professionnelle et efficace
          </motion.p>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
            onClick={() => (window.location.href = "/login")}
          >
            <span>Accéder à mon espace</span>
            <LogInIcon size={20} />
          </motion.button>
        </motion.div>
      </div>

      {/* Features Section - Élégant avec animations subtiles */}
      <div
        id="features"
        className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 shadow-md">
                <BrainIcon size={28} />
              </div>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-gray-800 mb-4"
            >
              Fonctionnalités Professionnelles
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Digi-Doc offre des outils puissants pour optimiser votre gestion
              documentaire.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
                className="bg-white rounded-lg p-8 shadow-md border border-gray-100 transition-all duration-200"
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div
                  className={`${feature.color} p-3 rounded-lg w-14 h-14 flex items-center justify-center mb-5 shadow-sm`}
                >
                  {feature.iconComponent}
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Élégant */}
      <div className="py-20 px-6 bg-gradient-to-r from-blue-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
          >
            Prêt à optimiser votre gestion documentaire ?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 mb-10"
          >
            Découvrez comment Digi-Doc peut transformer votre expérience
            d'archivage numérique.
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-lg shadow-lg transition-all duration-200"
            onClick={() => (window.location.href = "/login")}
          >
            Commencer maintenant
          </motion.button>
        </div>
      </div>

      {/* Footer - Élégant avec barres */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="flex items-center mb-6 md:mb-0">
              <img
                src={logo}
                alt="Digi-Doc Logo"
                className="w-10 h-10 rounded-full mr-3"
              />
              <span className="text-xl font-bold">Digi-Doc</span>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {["À propos", "Confidentialité", "Conditions", "Contact"].map(
                (item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-t border-b border-gray-800">
            <div>
              <h4 className="text-lg font-semibold mb-4">Produit</h4>
              <ul className="space-y-2">
                {["Fonctionnalités", "Tarifs", "Témoignages", "FAQ"].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2">
                {["Documentation", "Guides", "Tutoriels", "Blog"].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2">
                {["À propos", "Équipe", "Carrières", "Presse"].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                {["Confidentialité", "Conditions", "Sécurité", "Cookies"].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Digi-Doc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
