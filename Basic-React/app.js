      const app = document.getElementById("app");
      // React Components
      function Header({ title }) {
        return <h1> {createTitle(title)} </h1>;
      }
      function createTitle(title) {
        if (title) {
          return title;
        } else {
          return "Default title";
        }
      }
      function Homepage() {
        return (
          <>
            <Header title="Welcome to the homepage" />
            <Header />
            <p>This is the homepage</p>
          </>
        );
      }

      const root = ReactDOM.createRoot(app);
      root.render(<Homepage />);
      