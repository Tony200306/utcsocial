import axiosClient from "@/lib/userApi";
import { Report } from "@/types/reportType";
import { User } from "@/types/userType";
import { Thread } from './../types/threadType';

// Assuming 'User' is an interface or type that represents a single user
export const getAllUsers = async (): Promise<User[]> => {
    try {
        const response = await axiosClient.get(`/admins/users`);

        // Check for any error in the response
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        // Return the list of users
        return response.data.users as User[];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};
export const getAdminAndModerator = async (): Promise<User[]> => {
    try {
        const response = await axiosClient.get(`/admins/users/admin_moderator_management`);

        // Check for any error in the response
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        // Return the list of users
        return response.data.users as User[];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};


export const getAllThreads = async (): Promise<Thread[]> => {
    try {
        const response = await axiosClient.get(`/admins/threads`);

        // Check for any error in the response
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        // Return the list of users
        return response.data.threads as Thread[];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};





export const getThreadById = async ({ id }: { id: string }): Promise<Thread> => {
    try {
        const response = await axiosClient.get(`admins/threads/get/${id}`);


        if (response.data.error) {
            throw new Error(response.data.error);
        }
        // Return the list of users
        return response.data.thread as Thread;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};



export const updateReportStatus = async ({
    currentStatus, newStatus, reportId, data
}: { currentStatus: string, newStatus: string, reportId: string, data: object }): Promise<{ messesage: string }> => {
    try {

        const response = await axiosClient.put(`/report/report/status/`, { currentStatus, newStatus, reportId, data });

        // Kiểm tra xem API có trả lỗi hay không
        if (response.data.error) {
            throw new Error(response.data.error);
        }

        // Trả về dữ liệu thread
        return response.data as { messesage: string };
    } catch (error) {
        console.error("Error in followOrUnfollowThread:", error);
        throw error;
    }
};



export const getAllReports = async ({ page }: { page: number }): Promise<Report[]> => {
    try {
        const response = await axiosClient.get(`/report/reports/`, {
            params: { page },
        });
        // Check for any error in the response
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        // Return the list of users
        return response.data as Report[];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};

export const getReportById = async ({ id }: { id: string }): Promise<Report> => {
    try {
        const response = await axiosClient.get(`/report/reports/${id}`);
        // Chú ý không được dùng như này   bởi vì sẽ nhầm lẫn sang cái api trên và nó trả về all report
        // const response = await axiosClient.get(`/report/reports`, {
        //     params: { id },
        //     });

        // Check for any error in the response
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        // Return the list of users
        return response.data.report as Report;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};
export const getReportsBySearch = async ({ page, searchText }: { page: number; searchText: string }): Promise<Report[]> => {
    try {
        console.log("Fetching reports with searchText:", searchText, "on page:", page);
        const response = await axiosClient.get(`/report/search/`, {
            params: { page, searchText },
        });

        // Check for any error in the response
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        // Return the list of users
        return response.data as Report[];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};

export const updateUserRoleStatus = async ({
    id,
    roleStatus,
}: {
    id: string;
    roleStatus: string;
}): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await axiosClient.put(`/admins/users/updateRole/${id}`, { roleStatus });

        if (response.data.error) {
            throw new Error(response.data.error);
        }

        return response.data as { success: boolean; message: string };
    } catch (error) {
        console.error("Error updating user role status:", error);
        throw new Error("Failed to update user role status");
    }
};

export const updateUserRole: ({
    id,
    role,
}: {
    id: string;
    role: string;
}) => Promise<{ success: boolean; message: string }> = async ({
    id,
    role,
}: {
    id: string;
    role: string;
}) => {
        try {
            const response = await axiosClient.post(`/users/update-role/${id}`, { role });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data as { success: boolean; message: string };
        } catch (error) {
            console.error("Error updating user role:", error);
            throw new Error("Failed to update user role");
        }
    };

export const updateUserStatus = async ({
    id,
    status,
}: {
    id: string;
    status: string;
}): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await axiosClient.put(`/users/update-status/${id}`, { accountStatus: status });

        if (response.data.error) {
            throw new Error(response.data.error);
        }

        return response.data as { success: boolean; message: string };
    } catch (error) {
        console.error("Error updating user status:", error);
        throw new Error("Failed to update user status");
    }
};

export const toggleThreadVisibility = async ({
    id,
}: {
    id: string;
}): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await axiosClient.put(`admins/threads/block/${id}`);
        if (response.data.error) {
            throw new Error(response.data.error);
        }

        return response.data as { success: boolean; message: string };
    } catch (error) {
        console.error("Error toggling thread visibility:", error);
        throw new Error("Failed to toggle thread visibility");
    }
};