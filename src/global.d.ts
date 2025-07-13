// For mixpanel-browser
declare module "mixpanel-browser";

// For custom JSX elements (e.g., roundedPlaneGeometry)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      roundedPlaneGeometry: any;
    }
  }
}