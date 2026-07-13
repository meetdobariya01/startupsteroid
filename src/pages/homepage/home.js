import React from "react";
import Header from "../../components/header/header";
import Carouselmain from "../../components/carousel/carousel";
import Herosec from "../../components/herosec/herosec";
import Formulations from "../../components/formulations/formulations";
import Protocol from "../../components/protocol/protocol";
import Readyscore from "../../components/ReadyScore/readyscore";
import Audiencesection from "../../components/AudienceSection/audiencesection";
import Contactform from "../../components/contactform/contactform";
import Footer from "../../components/footer/footer";

const Home = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* carousel */}
      {/* <Carouselmain /> */}

      {/* Herosec */}
      <Herosec />

      {/* Formulations */}
      <Formulations />

      {/* Protocol */}
      <Protocol />

      {/* Readyscore */}
      <Readyscore />

      {/* Audiencesenction */}
      <Audiencesection />

      {/* contact form */}
      <Contactform />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
