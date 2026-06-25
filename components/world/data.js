// World content, grouped into themed walls. Each item becomes a framed
// picture; items without an `image` render a clean text logo on `color`.
export const sections = [
  {
    id: 'experience',
    title: 'Experience',
    wall: 'north',
    items: [
      {
        id: 'algoverse',
        title: 'Software Developer Intern',
        company: 'Algoverse',
        period: 'Aug 2024 – Mar 2025',
        desc:
          'Designed and implemented a Python LLM framework enabling models to self-assess tool usage via RAG and Knowledge Tracing, reducing API calls by up to 90% on benchmark QA datasets. Built a synthetic data pipeline using GPT-4o as a teacher to generate diagnostic pre-tests, optimizing inference-time API decisions without fine-tuning. Accepted and presented findings at the NAACL insights workshop.',
        skills: ['Python', 'LLMs', 'RAG', 'Knowledge Tracing', 'Research'],
        color: '#8B5CF6',
        image: '/websitepics/algoverselogo.png',
      },
      {
        id: 'tiaa',
        title: 'Software Engineer Intern',
        company: 'TIAA',
        period: 'Summer 2026 (Incoming)',
        desc:
          'Incoming Software Engineer Intern at TIAA, joining an engineering team to build and ship production software for a leading financial services organization.',
        skills: ['Software Engineering', 'Full-Stack', 'Agile'],
        color: '#E5B611',
        image: null,
      },
      {
        id: 'gt-research',
        title: 'Undergraduate Researcher',
        company: 'Georgia Tech Research',
        period: 'Spring 2026',
        desc:
          'Undergraduate research for the AI Makerspace Nexus (AI Nexus VIP), sponsored by NVIDIA. Contributing to open-source software and democratizing accessibility to the makerspace.',
        skills: ['AI', 'Open Source', 'Research', 'NVIDIA'],
        color: '#ffb86c',
        image: '/websitepics/VIPLOGO.png',
      },
      {
        id: 'code-ninjas',
        title: 'Coding Instructor',
        company: 'Code Ninjas',
        period: 'Apr 2024 – Sept 2025',
        desc:
          'Delivered comprehensive lessons on the principles of C, JavaScript, and Unity to students aged 6–17, fostering a deep understanding of programming concepts and game development techniques. Tutored 100+ students toward proficiency in coding and problem-solving, and led summer camps teaching kids to document their projects with digital media.',
        skills: ['C', 'JavaScript', 'Unity', 'Teaching', 'Leadership'],
        color: '#3B82F6',
        image: '/websitepics/codeninjas.png',
      },
    ],
  },
  {
    id: 'involvement',
    title: 'School Involvement',
    wall: 'east',
    items: [
      {
        id: 'bdbi',
        title: 'Machine Learning Engineer',
        company: 'Big Data Big Impact',
        period: 'Fall 2025 – Present',
        desc:
          'Machine learning engineering on a project subteam for Big Data Big Impact, developing a product that analyzes oil spills with satellite data to help create a more sustainable environment.',
        skills: ['Machine Learning', 'Python', 'Satellite Data'],
        color: '#50fa7b',
        image: '/websitepics/bdbilogo.png',
      },
      {
        id: 'claude-builder',
        title: 'Member',
        company: 'Claude Builder Club',
        period: '2025 – Present',
        desc:
          "Member of Georgia Tech's Claude Builder Club — building projects and exploring real-world applications with Claude and modern AI tooling alongside fellow student builders.",
        skills: ['AI', 'Claude', 'Building'],
        color: '#D97757',
        image: null,
      },
      {
        id: 'hive',
        title: 'Peer Instructor',
        company: 'The Hive @ Georgia Tech',
        period: 'Spring 2026',
        desc:
          'Selected as a peer instructor for the largest makerspace on campus. Teaching and mentoring students in computer science and engineering fundamentals, guiding them through personal and classroom projects.',
        skills: ['Teaching', 'Mentorship', 'Makerspace'],
        color: '#f1c40f',
        image: '/websitepics/hivelogo.png',
      },
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    wall: 'west',
    items: [
      {
        id: 'gymseekr',
        title: 'Gymseekr Mobile App',
        company: 'Gymseekr',
        period: 'Jun 2024 – Present',
        desc:
          'A mobile fitness app to discover nearby gyms. Built with React Native, AWS Amplify, and DynamoDB; led UI design, product features, and the backend with user sign-up and management. 200+ users on the Apple App Store, featured on Patch and sportsmedical.news.',
        skills: ['React Native', 'AWS Amplify', 'DynamoDB'],
        color: '#4488ff',
        image: '/websitepics/nearbygyms.png',
      },
      {
        id: 'walle',
        title: 'Wall-E Interactive Robot',
        company: 'Wall-E Robot',
        period: 'Jun 2024 – Jul 2024',
        desc:
          'A 3D-printed emotive robot that helps individuals with alexithymia express their emotions. Arduino-driven sensors, servos, Bluetooth, and LED matrices simulate emotional expressions; an MIT App Inventor Android app enables wireless control. Presented to 30+ engineers at the Bluestamp conference.',
        skills: ['Arduino', 'C++', 'MIT App Inventor'],
        color: '#ffb86c',
        image: '/websitepics/walle.png',
      },
      {
        id: 'servesmart',
        title: 'ServeSmart',
        company: 'ServeSmart (HackGT)',
        period: '2024',
        desc:
          'A HackGT project using machine learning to optimize food-donation logistics. Built with React, Flask, and Python, using Scikit-learn, TensorFlow, and XGBoost for predictive insights and a data-driven dashboard.',
        skills: ['React', 'Flask', 'Python', 'TensorFlow', 'XGBoost'],
        color: '#50fa7b',
        image: '/websitepics/dashboardservesmart.png',
      },
      {
        id: 'pebble',
        title: 'Pebble',
        company: 'Pebble (Cal Hacks)',
        period: '2024',
        desc:
          'A Cal Hacks project using computer vision for real-time detection with MediaPipe and YOLOv8, a React/Flask/Python stack, and voice interaction via VAPI.',
        skills: ['React', 'Python', 'MediaPipe', 'YOLOv8', 'VAPI'],
        color: '#7eb8ff',
        image: '/websitepics/pebble.png',
      },
      {
        id: 'remi',
        title: 'Remi',
        company: 'Remi (HackPrinceton)',
        period: 'Fall 2025',
        desc:
          'A HackPrinceton Fall 2025 project — an LLM-powered assistant built with React, Express.js, and the Gemini LLM, integrating Photon hardware, OAuth, and a NoSQL backend.',
        skills: ['React', 'Express.js', 'Gemini LLM', 'OAuth'],
        color: '#ff79c6',
        image: '/websitepics/remi4website.png',
      },
      {
        id: 'ece1100',
        title: 'ECE 1100 Project',
        company: 'ECE 1100',
        period: '2025',
        desc:
          'A Georgia Tech ECE 1100 hardware engineering design project, applying core electrical and computer engineering fundamentals to a hands-on build.',
        skills: ['Hardware', 'Engineering Design'],
        color: '#ff6b6b',
        image: '/websitepics/ece1100proj.jpg',
      },
    ],
  },
  {
    id: 'resume',
    title: 'Resume',
    wall: 'south',
    hideHeader: true, // the "View My Resume" canvas is enough — no wall title
    items: [
      {
        // `link` makes this frame act as a button: interacting opens the URL
        // instead of the detail panel.
        id: 'resume',
        title: 'View My Resume',
        company: 'View My Resume',
        period: '',
        desc: '',
        skills: [],
        color: '#7eb8ff',
        image: null,
        link: 'https://drive.google.com/file/d/1gKZ6nXmMucreQZq9B6dHABaEFULnUZZp/view?usp=sharing',
      },
    ],
  },
];
