import { useAuth } from '../context/AuthContext';
import HomeTile from '../components/HomeTile';
import { BedDouble, FileText, Pill, UserPlus } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  // Define the features available on the dashboard
  const features = [
    {
      icon: <UserPlus className="h-6 w-6" />,
      title: 'Patient Registration',
      description: 'Register new patients and manage their information.',
      linkTo: '/patient-registration',
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
      // This link is a placeholder; you'd typically go to a patient list first
      linkTo: '/patient-documents/1', 
    },
    {
      icon: <Pill className="h-6 w-6" />,
      title: 'Prescriptions',
      description: 'Create and view prescriptions for patients.',
      // This link is also a placeholder
      linkTo: '/prescriptions/1',
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
