package com.jobtracker.dto.request;

import com.jobtracker.entity.ApplicationStatus;
import lombok.Data;

@Data
public class JobApplicationRequest {
    private String company;
    private String role;
    private ApplicationStatus status;
    private String jobUrl;
    private String notes;
    private String resumeVersion;
}