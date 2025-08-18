import { useAuth } from '../context/AuthContext';
import HomeTile from '../components/HomeTile';
import { BedDouble, FileText, ListTodo, Pill, Siren, UserPlus, ClipboardClock } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();


  const features = [
    {
      icon: <Siren className="h-6 w-6" />,
      title: 'High-Priority Alerts',
      description: 'View real-time alerts for critical patients.',
      linkTo: '/alerts',
    },
    {
      icon: <UserPlus className="h-6 w-6" />,
      title: 'Patient Registration',
      description: 'Register new patients and manage their information.',
      linkTo: '/patient-registration',
    },
    {
      icon: <ListTodo className="h-6 w-6" />,
      title: 'Triage Dashboard',
      description: 'Manage and assign triage levels to incoming patients.',
      linkTo: '/triage-dashboard',
    },
    {
      icon: <BedDouble className="h-6 w-6" />,
      title: 'Bed Management',
      description: 'View and manage bed allocation for all hospital wards.',
      linkTo: '/bed-management',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Patient Documents',
      description: 'Upload and access documents for a specific patient.',

      linkTo: '/patient-documents/1',
    },
    {
      icon: <Pill className="h-6 w-6" />,
      title: 'Prescriptions',
      description: 'Create and view prescriptions for patients.',
      linkTo: '/prescriptions/1',
    },
    {
      icon: <ClipboardClock className="h-6 w-6" />,
      title: 'Appointment Request',
      description: 'Appointment for patients.',
      linkTo: '/appointment-management',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.full_name || 'Staff Member'}. Here's an overview of the system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature) => (
          <HomeTile
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            linkTo={feature.linkTo}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
