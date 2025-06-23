'use client';
import { useEffect } from 'react';
import { tmdbService } from '../services/api'; 

function App() {
  useEffect(() => {
    const test = async () => {
      const data = await tmdbService.search("fight club");
      console.log("TMDB Data:", data);
    };

    const test2 = async () => {
      const data = await tmdbService.getMovieDetails("550,")
      console.log("movie data: " , data)
    }

    test();
    test2();
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
