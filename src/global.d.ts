// For mixpanel-browser
declare module "*.jsx";
declare module "mixpanel-browser";
declare module "./components/GP_Scene";
declare module "./components/Test_Dissolve";
declare module "./components/GolfBallTrail";

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
