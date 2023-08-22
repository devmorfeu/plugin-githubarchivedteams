import { getConfig, onConfigChange } from './user/userConfig';

Promise.all([
    getConfig('extEnabled'),
]).then(([extEnabled]) => {
    if (!extEnabled) return;
    onConfigChange('hideEnable', (hideEnable) => getRepositoryList(hideEnable));
});
