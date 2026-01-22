// src/components/layout/Footer.tsx
export const Footer = () => {
  return (
    <footer className="mt-auto py-6 text-center text-gray-400 text-xs">
      <p>
        © {new Date().getFullYear()} NHATDEV. Chạy trên ASP.NET Core & React
      </p>
    </footer>
  );
};
