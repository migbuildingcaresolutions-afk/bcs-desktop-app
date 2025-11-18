import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content-wrapper">
        <header className="topbar">
          <h1>Building Care Solutions</h1>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
