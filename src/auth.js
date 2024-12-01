import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default (to, from, next) => {
  const router = useRouter();
  const auth = getAuth(); 

  onAuthStateChanged(auth, (user) => { 
    if (to.name !== 'signup' && !user) {
      next({ name: 'signup' });
    } else {
      next();
    }
  });
};