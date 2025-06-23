'use client';
import { useEffect } from 'react';
import { tmdbService } from '../services/api'; 

function App() {
  useEffect(() => {
    const test = async () => {
      console.log("we are doing something at least");
      const data = await tmdbService.search("fight club");
      console.log("TMDB Data:", data);
    };

    test();
  }, []);

  return <div>App Loaded</div>;
}

export default App;








  // export default function App() {
//   return (
//     <>
//     <h1> content goes here ... </h1>
//     </>
//   );
// }
