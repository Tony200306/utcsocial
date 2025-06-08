import axiosClient from '@/lib/userApi';

export const getTotalNewThreads = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): Promise<{ totalThreads: number }> => {
  try {
    const response = await axiosClient.get('/dashboard/totalnewthread', {
      params: { startDate, endDate },
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return { totalThreads: response.data.totalThreads };
  } catch (error) {
    console.error('Error fetching thread data:', error);
    throw new Error('Failed to fetch total threads');
  }
};

export const getTotalComments = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): Promise<{ totalComments: number }> => {
  try {
    const response = await axiosClient.get('/dashboard/totalcomment', {
      params: { startDate, endDate },
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return { totalComments: response.data.totalComments };
  } catch (error) {
    console.error('Error fetching thread data:', error);
    throw new Error('Failed to fetch total comment');
  }
};
export const getTotalNewUsers = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): Promise<{ totalnewusers: number }> => {
  try {
    const response = await axiosClient.get('/dashboard/totalnewuser', {
      params: { startDate, endDate },
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return { totalnewusers: response.data.totalNewUsers };
  } catch (error) {
    console.error('Error fetching thread data:', error);
    throw new Error('Failed to fetch total comment');
  }
};

export const getAreaChartNewUsers = async (): Promise<
  { month: string; totalRegistrations: number }[]
> => {
  try {
    const response = await axiosClient.get('/dashboard/areachartnewuser');

    // Check if the response contains an error
    if (response.data.error) {
      throw new Error(response.data.error);
    }

    // Return the data from the response
    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching area chart data:', error);
    throw new Error('Failed to fetch area chart new user data');
  }
};
export const getBarChartNewThreads = async (): Promise<
  { month: string; threads: number }[]
> => {
  try {
    const response = await axiosClient.get('/dashboard/barchartnewthreads'); // Adjust to your API endpoint

    // Check if the response contains an error
    if (response.data.error) {
      throw new Error(response.data.error);
    }

    // Return the data from the response
    console.log(response.data.data); // Logs the response data to the console
    return response.data.data; // Return the chart data in the format
  } catch (error: any) {
    console.error('Error fetching bar chart new threads data:', error);
    throw new Error('Failed to fetch bar chart new threads data');
  }
};