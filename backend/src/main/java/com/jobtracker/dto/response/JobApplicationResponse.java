package com.jobtracker.dto.response;

import com.jobtracker.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobApplicationResponse {
    private Long id;
    private String company;
    private String role;
    private ApplicationStatus status;
    private String jobUrl;
    private String notes;
    private String resumeVersion;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}