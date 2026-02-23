package com.jobtracker.service;

import com.jobtracker.dto.request.JobApplicationRequest;
import com.jobtracker.dto.response.JobApplicationResponse;
import com.jobtracker.entity.ApplicationStatus;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.User;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.exception.UnauthorizedException;
import com.jobtracker.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;

    public JobApplicationResponse create(JobApplicationRequest request, User user) {
        JobApplication application = JobApplication.builder()
                .user(user)
                .company(request.getCompany())
                .role(request.getRole())
                .status(request.getStatus() != null ? request.getStatus() : ApplicationStatus.APPLIED)
                .jobUrl(request.getJobUrl())
                .notes(request.getNotes())
                .resumeVersion(request.getResumeVersion())
                .build();

        return toResponse(jobApplicationRepository.save(application));
    }

    public List<JobApplicationResponse> getAllByUser(User user) {
        return jobApplicationRepository.findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public JobApplicationResponse getById(Long id, User user) {
        JobApplication application = findAndVerifyOwner(id, user);
        return toResponse(application);
    }

    public JobApplicationResponse update(Long id, JobApplicationRequest request, User user) {
        JobApplication application = findAndVerifyOwner(id, user);

        application.setCompany(request.getCompany());
        application.setRole(request.getRole());
        application.setStatus(request.getStatus());
        application.setJobUrl(request.getJobUrl());
        application.setNotes(request.getNotes());
        application.setResumeVersion(request.getResumeVersion());

        return toResponse(jobApplicationRepository.save(application));
    }

    public void delete(Long id, User user) {
        findAndVerifyOwner(id, user);
        jobApplicationRepository.deleteById(id);
    }

    public Map<String, Long> getAnalytics(User user) {
        return Map.of(
                "APPLIED", jobApplicationRepository.countByUserIdAndStatus(user.getId(), ApplicationStatus.APPLIED),
                "PHONE_SCREEN", jobApplicationRepository.countByUserIdAndStatus(user.getId(), ApplicationStatus.PHONE_SCREEN),
                "INTERVIEW", jobApplicationRepository.countByUserIdAndStatus(user.getId(), ApplicationStatus.INTERVIEW),
                "OFFER", jobApplicationRepository.countByUserIdAndStatus(user.getId(), ApplicationStatus.OFFER),
                "REJECTED", jobApplicationRepository.countByUserIdAndStatus(user.getId(), ApplicationStatus.REJECTED)
        );
    }

    private JobApplication findAndVerifyOwner(Long id, User user) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        if (!application.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to access this application");
        }

        return application;
    }

    private JobApplicationResponse toResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .company(application.getCompany())
                .role(application.getRole())
                .status(application.getStatus())
                .jobUrl(application.getJobUrl())
                .notes(application.getNotes())
                .resumeVersion(application.getResumeVersion())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}