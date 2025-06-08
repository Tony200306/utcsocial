import { useEffect, useState } from 'react';
import useUserStore from '@/store/useUserStore';

export const useUserStoreHydration = () => {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // Trigger rehydration
        const unsubHydrate = useUserStore.persist.onHydrate(() => {
            setHydrated(false);
        });

        const unsubFinishHydration = useUserStore.persist.onFinishHydration(() => {
            setHydrated(true);
        });

        setHydrated(useUserStore.persist.hasHydrated());

        return () => {
            unsubHydrate();
            unsubFinishHydration();
        };
    }, []);

    return hydrated;
};