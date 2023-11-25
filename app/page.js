import Image from "next/image";

export default function home() {
  return (
    <main
      className="flex flex-col align-items-center main"
      style={{
        marginLeft: "12.3rem",
        marginRight: "2rem",
        marginTop: "2rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "40px 20px",
        color: "#000",
      }}
    >
      <div
        style={{
          width: "60rem",
          height: "20rem",
          backgroundColor: "#fff",
          color: "#000",
          padding: "2rem 1rem",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <h1>Hello Chris!</h1>
        <h4>
          This is your Dashboard Main Page. When you enter your dashboard by
          default this page will be shown. You can add here other things
          later...
        </h4>
      </div>
    </main>
  );
}
