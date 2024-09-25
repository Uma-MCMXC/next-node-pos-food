import LoginForm from '../components/LoginForm'; // แก้ไขเส้นทางตามที่ตั้งของไฟล์

const SignInPage: React.FC = () => {
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default SignInPage;
