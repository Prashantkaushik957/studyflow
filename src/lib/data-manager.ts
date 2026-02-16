import { useStore } from './store';

export const DataManager = {
    exportData: () => {
        try {
            const state = useStore.getState();
            const data = {
                tasks: state.tasks,
                habits: state.habits,
                pomodoroSessions: state.pomodoroSessions,
                checkIns: state.checkIns,
                studyGoals: state.studyGoals,
                pomodoroSettings: state.pomodoroSettings,
                theme: state.theme,
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `studyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Export failed:', error);
            return false;
        }
    },

    importData: async (file: File): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const data = JSON.parse(content);

                    if (!data.version || !data.tasks) {
                        resolve({ success: false, message: 'Invalid backup file format' });
                        return;
                    }

                    // Hydrate store
                    useStore.setState((state) => ({
                        ...state,
                        tasks: data.tasks || [],
                        habits: data.habits || [],
                        pomodoroSessions: data.pomodoroSessions || [],
                        checkIns: data.checkIns || [],
                        studyGoals: data.studyGoals || [],
                        pomodoroSettings: data.pomodoroSettings || state.pomodoroSettings,
                        theme: data.theme || 'dark'
                    }));

                    resolve({ success: true, message: 'Data restored successfully' });
                } catch (error) {
                    resolve({ success: false, message: 'Failed to parse backup file' });
                }
            };
            reader.readAsText(file);
        });
    }
};
