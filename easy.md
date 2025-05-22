```
import { useApiStore } from '../stores/userApiUrl.ts'
const apiStore = useApiStore()
const apiBaseUrl = apiStore.apiBaseUrl
```

```
const userJson = localStorage.getItem('user');
const user = userJson ? JSON.parse(userJson) : null;
```
