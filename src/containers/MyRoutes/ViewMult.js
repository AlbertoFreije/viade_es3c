import React, { useState } from "react";
//import Button from "@material-ui/core/Button";
import { Button } from "./myroutes.style";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { cyan } from "@material-ui/core/colors";
import { AutoRotatingCarousel, Slide } from "material-auto-rotating-carousel";
<<<<<<< HEAD
import {PlayerDiv} from "./myroutes.style"
=======
// eslint-disable-next-line
import { Player } from "video-react";
import i18n from "i18n";
>>>>>>> origin/feature_myRoutes_front

const getMediaComponent = (url) => {
  if (url.includes('.mp4')) {
    return (<PlayerDiv><video autoplay controls src={url} width="640" height="380"></video></PlayerDiv>)
  } else {
    return <img id="img" src={url} width={640}
    height={360} alt={"Media for the route"}/>
  }
}

const AutoRotatingCarouselModal = ({
  handleOpen,
  setHandleOpen,
  isMobile,
  media
}) => {
  function createSlides(media) {
    var j;
    var arr = [];

    if(media.mult.length<=0){
       j = (<Slide
          media={ <img id="img" src={"img/illustration-noresults.png"} 
          width={640} height={360} alt={"No media for this route"} />}
          mediaBackgroundStyle={{ backgroundColor: cyan[600] }}
          key={Date.now()}
          style={{ backgroundColor: cyan[400] }}
          title={i18n.t("myRoutes.noMultTitle")}
          subtitle={i18n.t("myRoutes.noMult")}
        />)
         arr.push(j);
    }

    for (var i = 0; i < media.mult.length; i++) {
      
      j = (<Slide
          media={getMediaComponent(media.mult[i].url)}
          mediaBackgroundStyle={{ backgroundColor: cyan[600] }}
          style={{ backgroundColor: cyan[400] }}
           title={media.name}
            key={media.mult[parseInt(i)].date}
          subtitle={media.mult[parseInt(i)].date}
        />)
      arr.push(j);
    }
    return arr;
  }
  return (
    <div>
      {/* <Button onClick={() => setHandleOpen({ open: true })}>Open carousel</Button> */}
      <AutoRotatingCarousel
        open={handleOpen.open}
        onClose={() => setHandleOpen({ open: false })}
        onStart={() => setHandleOpen({ open: false })}
        autoplay={false}
        mobile={isMobile}
        style={{ position: "absolute" }}
        media={media}
      >
        {createSlides(media)}
      </AutoRotatingCarousel>
    </div>
  );
};

function MultsButton(params, name) {
  const [handleOpen, setHandleOpen] = useState({ open: false });
  const handleClick = () => {
    setHandleOpen({ open: true });
  };
  const matches = useMediaQuery("(max-width:600px)");
  return (
    <>
      <Button onClick={handleClick}>{i18n.t("myRoutes.viewMult")}</Button>
      <AutoRotatingCarouselModal
        isMobile={matches}
        handleOpen={handleOpen}
        setHandleOpen={setHandleOpen}
        media={params}
        name={name}
      />
    </>
  );
}

export default MultsButton;
