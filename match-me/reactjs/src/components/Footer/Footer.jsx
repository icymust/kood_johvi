import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} MatchMe</p>
    </footer>
  );
}

export default Footer;
