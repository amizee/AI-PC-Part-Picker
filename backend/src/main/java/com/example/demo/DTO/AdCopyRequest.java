package com.example.demo.DTO;

public class AdCopyRequest {
    private Long pcPartId;
    private boolean used;
    private boolean boxed;
    private int ageInMonths;
    private String title;
    private Long userId; // You may get this from the session in a real application

    // Getters and Setters

    public Long getPcPartId() {
        return pcPartId;
    }

    public void setPcPartId(Long pcPartId) {
        this.pcPartId = pcPartId;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }

    public boolean isBoxed() {
        return boxed;
    }

    public void setBoxed(boolean boxed) {
        this.boxed = boxed;
    }

    public int getAgeInMonths() {
        return ageInMonths;
    }

    public void setAgeInMonths(int ageInMonths) {
        this.ageInMonths = ageInMonths;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
