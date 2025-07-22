// For mixpanel-browser
declare module "mixpanel-browser";
declare module "./GP_Scene";
declare module "./Test_Dissolve";
declare module "./GolfBallTrail";

// For custom JSX elements (e.g., roundedPlaneGeometry)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      roundedPlaneGeometry: any;
    }
  }
  interface Window {
    ktx2loader?: any;
  }
}
