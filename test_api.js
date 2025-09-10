// Simple test script to check API endpoints
const testAPI = async () => {
    try {
        console.log('Testing API endpoints...');

        // Test speakers endpoint
        const speakersResponse = await fetch('http://localhost:5000/api/speakers');
        console.log('Speakers status:', speakersResponse.status);
        if (speakersResponse.ok) {
            const speakers = await speakersResponse.json();
            console.log('Speakers count:', speakers.length);
            console.log('First speaker:', speakers[0]);
        }

        // Test event schedules endpoint
        const schedulesResponse = await fetch('http://localhost:5000/api/eventschedules/events/1/schedules');
        console.log('Event schedules status:', schedulesResponse.status);
        if (schedulesResponse.ok) {
            const schedules = await schedulesResponse.json();
            console.log('Schedules count:', schedules.length);
            console.log('First schedule:', schedules[0]);
        } else {
            const errorText = await schedulesResponse.text();
            console.log('Error response:', errorText);
        }

    } catch (error) {
        console.error('Error testing API:', error);
    }
};

testAPI();






