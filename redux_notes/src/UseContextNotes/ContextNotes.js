
// Notes

// useContext is a hook in React that allows you to access the context values provided by a Context.
// Provider component in your component tree. It's useful for passing down data or state to components
//  without having to manually pass props through each intermediate component. Here's an example of how to use useContext in React





// useContext is a hook in React that allows you to access the context values provided by
//  a Context.Provider component in your component tree. It's useful for passing down data or state 
//  to components without having to manually pass props through each intermediate component.
//   Here's an example of how to use useContext in React:



import React, { createContext, useContext, useState } from 'react';

// Step 1: Create a context
const AuthContext = createContext();

// Step 2: Create a context provider
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 3: Create a component that consumes the context
const Home = () => {
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, User!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <button onClick={login}>Login</button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <div>
        <h1>Authentication Example</h1>
        <Home />
      </div>
    </AuthProvider>
  );
};

export default App;




import { buildYupLocale } from 'appYup';

import i18n from 'i18n/config';

import PropTypes from 'prop-types';

import { createContext, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

 

const MiniappContext = createContext();

const isDev = process.env.NODE_ENV === 'development';

 

function MiniappProvider({ children }) {

  const [segment, setSegment] = useState('mass');

  const [country, setCountry] = useState('AE');

  const [agentValid, setAgentValid] = useState();

  const [lang, setLang] = useState();

  const [mobileAgent, setMobileAgent] = useState();

  const { t } = useTranslation();

 

  const changeLanguage = (newLng) => {

    setLang(newLng);

    // window.sessionStorage.setItem('lang', newLng);

    console.log(newLng);

    i18n.changeLanguage(newLng);

    const direction = newLng === 'ar' ? 'rtl' : 'ltr';

    document.getElementsByTagName('html')[0].setAttribute('dir', direction);

 

    document.getElementsByTagName('html')[0].setAttribute('class', newLng);

 

    document.getElementsByTagName('html')[0].setAttribute('lang', newLng);

  };

 

  useEffect(() => {

    buildYupLocale(null, t);

  }, [t]);

 

  useEffect(() => {

    let resAgentJson;

    // mobile agent validation and language settings.

    if (!isDev) {

      if (!window.ABJSBridge?.abGetMobileAgent) {

        return;

      }

      const resAgent = window.ABJSBridge.abGetMobileAgent();

      resAgentJson = JSON.parse(resAgent);

    } else {

      // development env

      changeLanguage('en');

      window.sessionStorage.setItem('lang', 'en');

      // setCountry('JO');

      setAgentValid(true);

      setMobileAgent('web');

    }

 

    // fetch user segment

    if (!isDev) {

      if (!window.ABJSBridge?.abGetUserInfo) {

        return;

      }

      const result = window.ABJSBridge?.abGetUserInfo();

      //   const result = `{"data":{"country":"JO","lang":"EN","segment":"MASS"}}`;

      const resultJson = JSON.parse(result);

      if (typeof resultJson.data === 'object' && resultJson.data) {

        const { lang, segment, country } = resultJson.data;

        if (

          segment === 'MASS' ||

          segment === 'PREMIUM' ||

          segment === 'SHABAB' ||

          segment === 'ELITE'

        ) {

          setSegment(segment.toLowerCase());

          document.body.className = document.body.className + ' ' + segment.toLowerCase();

        }

        if (typeof lang === 'string') {

          window.sessionStorage.setItem('lang', lang.toLowerCase());

          changeLanguage(lang.toLowerCase());

        }

        if (typeof country === 'string') {

          setCountry(country.toUpperCase());

          window.sessionStorage.setItem('country', country.toUpperCase());

        }

        if (resAgentJson && resAgentJson?.data && resAgentJson?.data.mobileAgent) {

          setAgentValid(/AM/.test(resAgentJson.data.mobileAgent));

        }

      }

    } else {

      // development env

      const language = 'en';

      changeLanguage(language);

      const s = 'premium';

      setCountry('AE');

      setSegment(s);

      window.sessionStorage.setItem('country', 'AE');

      document.body.className = document.body.className + ' ' + s.toLowerCase();

    }

  }, []);

 

  const value = { segment: segment, country: country, lang: lang, mobileAgent: mobileAgent };

  if (!agentValid) {

    return null;

  }

  const direction = i18n.dir();

 

  const language = i18n.resolvedLanguage;

 

  document.getElementsByTagName('html')[0].setAttribute('dir', direction);

 

  document.getElementsByTagName('html')[0].setAttribute('class', language);

 

  document.getElementsByTagName('html')[0].setAttribute('lang', language);

  return <MiniappContext.Provider value={value}>{children}</MiniappContext.Provider>;

}

 

function useMiniapp() {

  const context = useContext(MiniappContext);

  if (context === undefined) {

    return {};

    // throw new Error('useMiniapp must be used within a MiniappProvider');

  }

  console.log(context, 'all data in context');

  return context;

}

 

MiniappProvider.propTypes = {

  children: PropTypes.any,

};

 

export { MiniappProvider, useMiniapp };

const direction = useMemo(() => (lang === 'ar' ? 'rtl' : 'ltr'), [lang]);

// Avoiding Unnecessary Recalculations: In React, state updates or component re-renders
//  can trigger the re-execution of functional components. In this case, lang might change, 
//  and if direction is computed directly without useMemo, it would be re-computed every time 
//  the component re-renders, even if lang hasn't changed. This can be computationally expensive, 
//  especially if the calculation is complex.

// Memoization for Performance: useMemo is a hook in React that allows you to memoize (cache) the 
// result of a function so that it's only re-computed when its dependencies change. In this case, 
// the result of the arrow function (lang === 'ar' ? 'rtl' : 'ltr') is memoized based on the lang dependency.

// Dependency Array: The second argument to useMemo is an array of dependencies. It specifies which 
// variables or values, when changed, should trigger the re-computation of the memoized value. In this case,
//  [lang] is provided as the dependency array, so direction will only be recomputed if lang changes.

// By using useMemo, the code optimizes performance by ensuring that the direction value is recalculated only 
// when necessary, which is when the lang value changes. This prevents unnecessary calculations and can lead to 
// improved rendering performance in components where direction is used.


//Theme override mui


import { Components } from '@mui/material';

 

const components: Components = {

  MuiButton: {

    defaultProps: {

      fullWidth: true,

      variant: 'contained',

      color: 'primary',

    },

    styleOverrides: {

      root: {

        minHeight: '40px',

        borderRadius: '50px',

        fontWeight: 'bold',

        containedPrimary: {

          color: '#fff',

        },

        outlinedPrimary: {

          color: 'primary',

        },

      },

      containedPrimary: {

        color: '#fff',

      },

      outlinedPrimary: {

        color: 'primary',

      },

    },

  },

  MuiIcon: {

    defaultProps: {

      color: 'primary',

    },

  },

  MuiSelect: {

    defaultProps: {

      variant: 'outlined',

    },

  },

  MuiOutlinedInput: {

    defaultProps: {

      notched: false,

    },

    styleOverrides: {

      root: {

        backgroundColor: '#fff',

        borderRadius: '10px',

        borderWidth: '1px',

        borderColor: 'primary.light',

        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {

          borderWidth: '1px',

          borderColor: 'primary.light',

        },

      },

 

      input: {

        padding: '6px 8px',

      },

      // '&.Mui-disabled': {

      //   backgroundColor: '#cdcdcd',

      // },

    },

  },

  MuiInputLabel: {

    defaultProps: {

      shrink: false,

    },

    styleOverrides: {

      formControl: {

        fontWeight: 'bold',

        fontSize: '14px',

        transform: 'none',

        position: 'static',

        // marginBottom: '2px',

        '&.Mui-focused': {

          color: 'var(--theme-color-global-default-80)',

          transform: 'none',

          position: 'static',

        },

      },

    },

  },

  MuiFormLabel: {

    styleOverrides: {

      root: {

        fontWeight: 'bold',

        fontSize: '14px',

        '&.Mui-focused': {

          color: 'var(--theme-color-global-default-80)',

        },

        '&.Mui-error': {

          color: 'var(--theme-color-global-default-80)',

        },

      },

    },

  },

  MuiTextField: {

    defaultProps: {

      variant: 'outlined',

      fullWidth: true,

    },

    // styleOverrides: {

    //   '& .MuiOutlinedInput-root': {

    //     borderRadius: '10px',

    //     borderWidth: '1px',

    //   },

    //   '&$disabled': {

    //     backgroundColor: '#cdcdcd',

    //   },

    //   '&$focused': {

    //     borderColor: 'primary',

    //   },

    //   margin: 'dense',

    // },

  },

  MuiChip: {

    styleOverrides: {

      root: {

        margin: '5px 5px',

        color: '#fff',

        boxShadow: '0 0 5px 0px #00000050',

      },

    },

  },

  MuiFormHelperText: {

    styleOverrides: {

      root: {

        fontWeight: 'bold',

        fontSize: '12px',

        marginInline: '6px',

      },

    },

  },

  MuiPopover: {

    styleOverrides: {

      root: {

        maxHeight: 'calc( 100% - 80px)',

      },

      paper: {

        borderRadius: '1.5em',

      },

    },

  },

 

  MuiTab: {

    defaultProps: {

      disableRipple: true,

    },

    styleOverrides: {

      root: {

        // textColorPrimary: '#575757',

        textTransform: 'none',

        fontWeight: 'bold',

        fontSize: '16px',

 

        '&.Mui-selected': {

          color: '#575757',

        },

      },

    },

  },

};

export { components };


import { colors, PaletteOptions } from '@mui/material';

 

export const palette: PaletteOptions = {

  success: {

    main: colors.green[600],

  },

  warning: {

    main: colors.orange[600],

  },

  error: {

    main: colors.red[600],

  },

  default: {

    main: '#231f20',

    light: '#231f20cc',

  },

  neutral: {

    main: '#818a8f',

  },

};

 

declare module '@mui/material/styles' {

  interface Palette {

    default: Palette['primary'];

    neutral: Palette['primary'];

  }

  interface PaletteOptions {

    default: PaletteOptions['primary'];

    neutral: PaletteOptions['primary'];

  }

}




import { Palette } from '@mui/material';

import { TypographyOptions } from '@mui/material/styles/createTypography';

type TypoGraphyPaletteReturn = (palette: Palette) => TypographyOptions;

export const typography: TypoGraphyPaletteReturn = (palette) =>

  ({

    fontFamily: 'PT Sans',

    h1: {

      color: palette.default.main,

      fontWeight: 'bold',

      fontSize: '21px',

    },

    h2: {

      color: palette.default.light,

      fontWeight: 'bold',

      fontSize: '18px',

    },

    h3: {

      fontWeight: 'bold',

      fontSize: '17px',

    },

    subtitle1: {

      fontWeight: 'bold',

      fontSize: '16px',

      color: palette.default.light,

    },

    subtitle2: {

      fontWeight: 'bold',

      fontSize: '12px',

    },

    h4: {

      fontWeight: 'normal',

      fontSize: '12px',

      color: palette.default.light,

    },

  } as TypographyOptions);

 

declare module '@mui/material/styles' {

  interface TypographyVariants {

    largeTitle: React.CSSProperties;

  }

 

  interface TypographyVariantOptions {

    largeTitle?: React.CSSProperties;

  }

}

declare module '@mui/material/Typography' {

  interface TypographyPropsVariantOverrides {

    largeTitle: true;

  }

}




//ACCOUNT SWIPER


<AccountSwiper

selectedIndex={selectedAccountIdx}

onChangeSelectedIndex={accountSelectionHandler}

accounts={accounts}

/>

// Import Swiper React components   import ... by Badira P P - Technology Associate
17:34
Badira P P - Technology Associate

// Import Swiper React components



import { Box, Typography } from '@mui/material';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles

// swiper bundle styles

import 'swiper/swiper-bundle.min.css';



// swiper core styles

import 'swiper/swiper.min.css';



// modules styles

// import 'swiper/components/navigation/navigation.min.css';

// import 'swiper/components/pagination/pagination.min.css';

// import 'swiper/css';

// import 'swiper/swiper.less';

// import 'swiper/swiper.scss';

// import 'swiper/swiper-bundle.css';

// import 'swiper/swiper-bundle.min/css';

// import 'swiper/css/pagination';



import './styles.scss';



// import required modules



import { useMiniapp } from 'common/ab-miniapp-ui/MiniappProvider/MiniappProvider';

import { AccountDetails } from 'features/api/payment.service';

// import { Pagination } from 'swiper';



type Props = {

accounts?: AccountDetails[];

selectedIndex: number;

onChangeSelectedIndex: (index: number) => void;

};



function AccountSwiper({ selectedIndex, onChangeSelectedIndex, accounts }: Props) {

const { lang } = useMiniapp();

return (

<Swiper

slidesPerView={1.3}

spaceBetween={15}

centeredSlides={true}

initialSlide={selectedIndex}

dir={lang === 'ar' ? 'rtl' : 'ltr'}

// pagination={{

//   dynamicBullets: true,

// }}

onInit={(swiper) => swiper.slideTo(selectedIndex)}

onSlideChange={(swiper) => onChangeSelectedIndex(swiper.activeIndex)}

// modules={[Pagination]}

className="AbSwiper"

>

{accounts?.map(

({

  accountNumber,

  accountTypeDescriptionEn,

  accountTypeDescriptionAr,

  availableBalance,

  currency,

}) => (

  <SwiperSlide key={accountNumber}>

    <Box

      display="flex"

      sx={{

        flexDirection: 'column',

        alignItems: 'stretch',

        flexGrow: '1',

        justifyContent: 'space-between',

        p: '12px',

      }}

    >

      <Box display="flex" sx={{ flexDirection: 'column', alignItems: 'stretch' }}>

        <Typography variant="body2">

          {lang === 'ar' ? accountTypeDescriptionAr : accountTypeDescriptionEn}

        </Typography>

        <Typography variant="caption" color="#ffffffcc">

          {accountNumber}

        </Typography>

      </Box>

      <Box display="flex" sx={{ justifyContent: 'flex-end' }}>

        <Typography variant="body2">

          {availableBalance} {currency}

        </Typography>

      </Box>

    </Box>

  </SwiperSlide>

),

)}

</Swiper>

);

}



export default AccountSwiper;


<AccountSwiper

selectedIndex={selectedAccountIdx}

onChangeSelectedIndex={accountSelectionHandler}

accounts={accounts}

/>



//USESUSPENSE

[6:04 pm, 06/09/2023] Baadhira: import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('Welcome')}</h1>
      <p>{t('Hello, {{name}}!', { name: 'John' })}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
}

export default App;
//  In this example:

// We import the Suspense component from React, which allows us to handle loading states 
// for components that have asynchronous content.

// We use the useTranslation hook from react-i18next to access translation functions (t) 
// and the i18n instance.

// Inside the MyComponent component, we use the t function to translate text. Notice that we have 
// a placeholder {{name}} for a dynamic value.

// In the App component, we wrap MyComponent with the Suspense component. We provide a fallback prop,
//  which is displayed while translations are loading. This is where useSuspense comes into play.

// When you render the App component, it will automatically handle the asynchronous loading of translations.
//  If translations are not yet loaded, it will display "Loading..." until the translations are ready. Once translations are loaded,
//   it will render MyComponent with the translated content.

// This is a basic example of how to use useSuspense to manage asynchronous translation loading in a React application. 
// It simplifies the handling of loading states when fetching translations dynamically.


//i18


import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import en from 'locales/en/translation.json';

import ar from 'locales/ar/translation.json';

import { buildYupLocale } from 'appYup';

 

export const resources = {

  en: { translation: en },

  ar: { translation: ar },

} as const;

 

export const availableLanguages = Object.keys(resources);

 

i18n.use(initReactI18next).init(

  {

    resources,

 

    fallbackLng: 'en',

    react: {

      // Turn off the use of React Suspense

      useSuspense: false,

    },

    supportedLngs: ['ar', 'en'],

    interpolation: {

      escapeValue: false, // not needed for react as it escapes by default

    },

  },

  buildYupLocale,

);

 

export default i18n;