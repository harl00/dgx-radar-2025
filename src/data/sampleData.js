// Sample data for the radar visualization
console.log('Loading sample data...');
const sampleData = [
  {
    name: "React",
    quadrant: "legacy",
    ring: "6-12m",
    description: "<p>A JavaScript library for building user interfaces.</p><p>React makes it painless to create interactive UIs.</p>",
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
    description: "<p>A JavaScript runtime built on Chrome's V8 JavaScript engine.</p>",
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
    description: "<p>A platform for developing, shipping, and running applications in containers.</p>",
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
    description: "<p>An end-to-end open source platform for machine learning.</p>",
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
  }
];

export default sampleData;
