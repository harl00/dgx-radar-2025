// Sample data for the radar visualization
console.log('Loading sample data...');
const sampleData = [
  {
    name: "React",
    quadrant: "legacy",
    ring: "6-12m",
    description: "# React\n\nA JavaScript library for building user interfaces.\n\nReact makes it painless to create interactive UIs.\n\n## Key Features\n\n* Declarative views\n* Component-based architecture\n* Learn once, write anywhere",
    isNew: 'TRUE',
    status: 'NEW'
  },
  {
    name: "Vue.js",
    quadrant: "legacy",
    ring: "1-2y",
    description: "<p>An approachable, performant and versatile framework for building web user interfaces.</p>"
  },
  {
    name: "Angular",
    quadrant: "legacy",
    ring: "3y+",
    description: "<p>A platform and framework for building single-page client applications using HTML and TypeScript.</p>"
  },
  {
    name: "Svelte",
    quadrant: "resiliency",
    ring: "3y+",
    description: "<p>A radical new approach to building user interfaces.</p><p>Svelte shifts the work into a compile step rather than using a virtual DOM.</p>"
  },
  {
    name: "Node.js",
    quadrant: "resiliency",
    ring: "6-12m",
    description: "A JavaScript runtime built on Chrome's V8 JavaScript engine.\n\nNode.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.\n\n```javascript\nconst http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.end('Hello World');\n});\n\nserver.listen(3000);\n```",
    isNew: 'TRUE'
  },
  {
    name: "Django",
    quadrant: "resiliency",
    ring: "1-2y",
    description: "<p>A high-level Python web framework that encourages rapid development and clean, pragmatic design.</p>"
  },
  {
    name: "Ruby on Rails",
    quadrant: "culture",
    ring: "3y+",
    description: "<p>A web application framework written in Ruby.</p><p>Rails is a model–view–controller (MVC) framework, providing default structures for a database, a web service, and web pages.</p>"
  },
  {
    name: "GraphQL",
    quadrant: "culture",
    ring: "1-2y",
    description: "<p>A query language for APIs and a runtime for fulfilling those queries with your existing data.</p>"
  },
  {
    name: "Docker",
    quadrant: "culture",
    ring: "6-12m",
    description: "A platform for developing, shipping, and running applications in containers.\n\n> Docker enables you to separate your applications from your infrastructure so you can deliver software quickly.\n\nBenefits include:\n1. Fast, consistent delivery of your applications\n2. Responsive deployment and scaling\n3. Running more workloads on the same hardware",
    isNew: 'TRUE'
  },
  {
    name: "Kubernetes",
    quadrant: "platforms",
    ring: "1-2y",
    description: "<p>An open-source system for automating deployment, scaling, and management of containerized applications.</p>"
  },
  {
    name: "Terraform",
    quadrant: "platforms",
    ring: "3y+",
    description: "<p>An open-source infrastructure as code software tool that provides a consistent CLI workflow to manage hundreds of cloud services.</p>"
  },
  {
    name: "AWS Lambda",
    quadrant: "platforms",
    ring: "1-2y",
    description: "<p>A serverless compute service that lets you run code without provisioning or managing servers.</p>"
  },
  {
    name: "TensorFlow",
    quadrant: "platforms",
    ring: "6-12m",
    description: "An end-to-end open source platform for machine learning.\n\nTensorFlow provides a comprehensive ecosystem of tools, libraries, and community resources that lets researchers push the state-of-the-art in ML and developers easily build and deploy ML-powered applications.\n\n## Use Cases\n* Image classification\n* Natural language processing\n* Time series forecasting",
    isNew: 'TRUE'
  },
  {
    name: "PyTorch",
    quadrant: "legacy",
    ring: "1-2y",
    description: "<p>An open source machine learning framework that accelerates the path from research prototyping to production deployment.</p>"
  },
  {
    name: "Apache Kafka",
    quadrant: "resiliency",
    ring: "3y+",
    description: "<p>A distributed event streaming platform capable of handling trillions of events a day.</p>"
  },
  {
    name: "Elasticsearch",
    quadrant: "culture",
    ring: "1-2y",
    description: "<p>A distributed, RESTful search and analytics engine capable of addressing a growing number of use cases.</p>"
  },
  {
    name: "Cloud Skills",
    quadrant: "platforms",
    ring: "0-6m",
    description: "**Multi-cloud service navigation (AWS, Azure, GCP)**: Understanding the core services, pricing models, and management interfaces across major cloud providers. Essential for government teams to avoid vendor lock-in and leverage best-of-breed solutions while maintaining competitive procurement options.\n\n**Infrastructure-as-Code basics (Terraform, CloudFormation)**\nAbility to define and manage infrastructure through code rather than manual configuration. Critical for ensuring reproducible, auditable, and version-controlled infrastructure deployments that meet government transparency and compliance requirements.\n\n**Container orchestration fundamentals (Kubernetes, Docker)**\nSkills in containerizing applications and managing container lifecycles at scale. Enables consistent deployment across environments while improving resource utilization and application portability across different cloud platforms.\n\n**API gateway management and service mesh basics**\nManaging traffic routing, security policies, and service communication in distributed systems. Essential for creating secure, scalable integration points between government services and external systems while maintaining proper access controls.",
    isNew: 'TRUE',
    status: 'NEW'
  },
  {
    name: "DevSecOps Practices",
    quadrant: "culture",
    ring: "0-6m",
    description: "# DevSecOps Practices\n\nIntegrating security throughout the development lifecycle to ensure systems are secure by design.\n\n## Key Components\n\n* Automated security testing in CI/CD pipelines\n* Infrastructure as code security scanning\n* Container image vulnerability scanning\n* Secret management and rotation\n* Compliance as code implementation\n\n## Benefits\n\n* Reduces security vulnerabilities in production systems\n* Decreases time to remediate security issues\n* Improves overall system reliability and compliance\n* Enables faster delivery while maintaining security standards",
    isNew: 'TRUE',
    status: 'NEW'
  }
];

export default sampleData;
