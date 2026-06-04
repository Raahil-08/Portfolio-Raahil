import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../ui/animated-modal";
import SmoothScroll from "../smooth-scroll";
import { cn } from "@/lib/utils";
import { FloatingDock } from "../ui/floating-dock";
import { TypographyP } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import SlideShow from "@/components/slide-show";

import { RiNextjsFill, RiReactjsFill } from "react-icons/ri";
import { SiVite, SiSupabase, SiPostgresql } from "react-icons/si";

interface Skill {
  title: string;
  bg: string;
  fg: string;
  icon: React.ReactNode;
}

interface Bullet {
  text: string;
  images?: string[];
}

interface SideQuest {
  title: string;
  category: string;
  src: string;
  description: string;
  link: string;
  bullets: Bullet[];
  skills: { frontend: Skill[]; backend: Skill[] };
}

const sideQuests: SideQuest[] = [
  {
    title: "www.prithvix.in",
    category: "Agritech Platform",
    src: "/assets/side-quests-screenshots/PrithviX/hero.png",
    description:
      "I built an end-to-end agritech platform that digitizes rural farming operations across India. The project includes a highly animated, high-converting marketing site and a custom internal admin portal to manage leads and logistics.",
    link: "https://www.prithvix.in",
    bullets: [
      {
        text: "Developed a blazing-fast marketing site using Next.js and Tailwind CSS, focused on SEO and high conversion rates.",
        images: [
          "/assets/side-quests-screenshots/PrithviX/hero.png",
          "/assets/side-quests-screenshots/PrithviX/p1.png",
          "/assets/side-quests-screenshots/PrithviX/p2.png",
          "/assets/side-quests-screenshots/PrithviX/p3.png",
        ],
      },
      {
        text: "Implemented a custom multilingual system from scratch to support English, Hindi, Gujarati, and Punjabi without relying on heavy third-party libraries.",
        images: [
          "/assets/side-quests-screenshots/PrithviX/hindi.png",
          "/assets/side-quests-screenshots/PrithviX/Gujarati.png",
          "/assets/side-quests-screenshots/PrithviX/punjabi.png",
        ],
      },
      {
        text: "Created buttery-smooth scrolling and micro-animations using Framer Motion, GSAP, and Lenis to give the site a premium feel.",
        images: [
          "/assets/side-quests-screenshots/PrithviX/animation1.mov",
          "/assets/side-quests-screenshots/PrithviX/animation2.mp4",
        ],
      },
    ],
    skills: {
      frontend: [
        { title: "Next.js", bg: "black", fg: "white", icon: <RiNextjsFill /> },
        { title: "React", bg: "black", fg: "white", icon: <RiReactjsFill /> },
        { title: "Vite", bg: "black", fg: "white", icon: <SiVite /> },
      ],
      backend: [
        { title: "Supabase", bg: "black", fg: "white", icon: <SiSupabase /> },
        { title: "PostgreSQL", bg: "black", fg: "white", icon: <SiPostgresql /> },
      ],
    },
  },
];

const SideQuestsSection = () => {
  return (
    <section id="side-quests" className="max-w-7xl mx-auto md:h-[130vh]">
      <a href="#side-quests">
        <h2
          className={cn(
            "bg-clip-text text-4xl text-center text-transparent md:text-7xl pt-16",
            "bg-gradient-to-b from-black/80 to-black/50",
            "dark:bg-gradient-to-b dark:from-white/80 dark:to-white/20 dark:bg-opacity-50 mb-32"
          )}
        >
          Side Quests
        </h2>
      </a>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {sideQuests.map((quest, index) => (
          <QuestModal key={index} quest={quest} />
        ))}
      </div>
    </section>
  );
};

const QuestModal = ({ quest }: { quest: SideQuest }) => {
  return (
    <div className="flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-transparent flex justify-center group/modal-btn">
          <div
            className="relative w-[400px] h-auto rounded-lg overflow-hidden"
            style={{ aspectRatio: "3/2" }}
          >
            <img
              className="absolute w-full h-full top-0 left-0 hover:scale-[1.05] transition-all object-cover"
              src={quest.src}
              alt={quest.title}
            />
            <div className="absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none">
              <div className="flex flex-col h-full items-start justify-end p-6">
                <div className="text-lg text-left text-white">{quest.title}</div>
                <div className="text-xs bg-white text-black rounded-lg w-fit px-2 mt-1">
                  {quest.category}
                </div>
              </div>
            </div>
          </div>
        </ModalTrigger>
        <ModalBody className="md:max-w-4xl md:max-h-[80%] overflow-auto">
          <SmoothScroll isInsideModal={true}>
            <ModalContent>
              <QuestContents quest={quest} />
            </ModalContent>
          </SmoothScroll>
        </ModalBody>
      </Modal>
    </div>
  );
};

const QuestContents = ({ quest }: { quest: SideQuest }) => {
  return (
    <>
      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
        {quest.title}
      </h4>
      <div className="flex flex-col md:flex-row md:justify-evenly max-w-screen overflow-hidden md:overflow-visible">
        <div className="flex flex-row md:flex-col-reverse justify-center items-center gap-2 text-3xl mb-8">
          <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-500">
            Frontend
          </p>
          {quest.skills.frontend?.length > 0 && (
            <FloatingDock items={quest.skills.frontend} />
          )}
        </div>
        {quest.skills.backend?.length > 0 && (
          <div className="flex flex-row md:flex-col-reverse justify-center items-center gap-2 text-3xl mb-8">
            <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-500">
              Backend
            </p>
            <FloatingDock items={quest.skills.backend} />
          </div>
        )}
      </div>

      <div className="flex flex-col px-4 md:px-8 py-4">
        <TypographyP className="font-mono mb-6">
          {quest.description}
        </TypographyP>

        <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
          <a
            className="font-mono underline flex gap-2"
            rel="noopener"
            target="_blank"
            href={quest.link}
          >
            <Button variant={"default"} size={"sm"}>
              Visit Website
              <ArrowUpRight className="ml-3 w-5 h-5" />
            </Button>
          </a>
        </div>

        <ul className="space-y-12">
          {quest.bullets.map((bullet, idx) => (
            <li key={idx} className="flex flex-col">
              <div className="flex items-start">
                <TypographyP className="font-mono">
                  {bullet.text}
                </TypographyP>
              </div>
              
              {bullet.images && bullet.images.length > 0 && (
                <div className="mt-8 mb-4 w-full">
                  <SlideShow images={bullet.images} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SideQuestsSection;
