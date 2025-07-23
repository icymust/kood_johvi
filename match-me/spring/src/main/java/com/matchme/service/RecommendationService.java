package com.matchme.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.tartarus.snowball.ext.EnglishStemmer;

import com.matchme.dto.ScoredProfile;
import com.matchme.entity.UserPreferences;
import com.matchme.entity.UserProfile;
import com.matchme.repository.UserPreferencesRepository;
import com.matchme.repository.UserProfileRepository;
import com.matchme.security.CustomUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserProfileRepository profileRepository;
    private final UserPreferencesRepository userPreferencesRepository;

    // MAIN METHOD TO GET RECOMMENDATIONS

    public ResponseEntity<?> getRecommendations(HttpServletRequest request) {

        CustomUserDetails userDetails = getAuthenticatedUser();
        UUID currentUserId = userDetails.getId();

        // Get the current users profile
        UserProfile userProfile = profileRepository.findByUserId(currentUserId)
        .orElse(null); // If profile is not found, return null

         // Check if the profile is found
         if (userProfile == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST) // HTTP 400 (Bad Request)
                    .body(Map.of("message", "User profile is incomplete. Please fill out all fields."));
        }

        // Check if the profile is complete
        if (!isProfileComplete(userProfile)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST) 
                    .body(Map.of("message", "User profile is incomplete. Please fill out all fields."));
        }

        // Get the current users preferences
        UserPreferences userPreferences = userPreferencesRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("Preferences for user not found"));

        // Check if preferences are complete
        if (!arePreferencesComplete(userPreferences)) {
    return ResponseEntity
            .status(HttpStatus.BAD_REQUEST) 
            .body(Map.of("message", "User preferences are incomplete. Please fill out all fields."));
}

        // current users preferences for scoring
        List<String> userGenderPrefs = stringToList(userPreferences.getGenderPreference());
        List<String> userRelationships = stringToList(userPreferences.getRelationshipTypes());
        List<String> userLifestyles = stringToList(userPreferences.getLifestylePreferences());
        List<String> userLanguages = stringToList(userPreferences.getPreferredLanguages());

        // Fetch filtered (age, connection) candidates within the radius, excluding the
        // user
        List<UserProfile> filteredCandidates = profileRepository.findEligibleCandidates(
                userProfile.getLatitude(),
                userProfile.getLongitude(),
                userProfile.getRadius(),
                currentUserId,
                userPreferences.getMinAge(),
                userPreferences.getMaxAge());

        List<UUID> candidateIds = filteredCandidates.stream()
                .map(UserProfile::getUserId)
                .toList();

        // Batch fetch preferences for all candidates
        Map<UUID, UserPreferences> preferencesMap = userPreferencesRepository.findAllByUserIdIn(candidateIds)
                .stream()
                .collect(Collectors.toMap(UserPreferences::getUserId, Function.identity()));

        // Score each candidate in parallel for performance
        List<ScoredProfile> scoredProfiles = filteredCandidates.parallelStream()
                .map(candidate -> {
                    UserPreferences candidatePreferences = preferencesMap.get(candidate.getUserId());
                    if (candidatePreferences == null)
                        return null;

                    // Early discard if gender or relationship type mismatches
                    if (!userGenderPrefs.contains("any") && !userGenderPrefs.contains(candidate.getGender())) {
                        return null;
                    }

                    List<String> candidateRelationships = stringToList(candidatePreferences.getRelationshipTypes());
                    if (Collections.disjoint(userRelationships, candidateRelationships)) {
                        return null;
                    }

                    // Remaining scores
                    double genderScore = 100; // already matched above
                    double relationshipScore = 100; // already matched above
                    double aboutMeScore = calculateAboutMeScore(userProfile.getAboutMe(), candidate.getAboutMe());

                    double interestsScore = calculateInterestsScore(
                            userProfile.getInterests(), candidate.getInterests());

                    List<String> candidateLifestyles = stringToList(candidatePreferences.getLifestylePreferences());
                    double lifestyleScore = calculateSimilarityScore(userLifestyles, candidateLifestyles);

                    List<String> candidateLanguages = stringToList(candidatePreferences.getPreferredLanguages());
                    double languageScore = calculateSimilarityScore(userLanguages, candidateLanguages);

                    double finalScore = (genderScore * 0.15) +
                            (aboutMeScore * 0.15) +
                            (interestsScore * 0.25) +
                            (relationshipScore * 0.15) +
                            (lifestyleScore * 0.15) +
                            (languageScore * 0.15);

                    if (finalScore >= 30) {
                        return new ScoredProfile(candidate, finalScore);
                    }
                    return null;
                })
                .filter(score -> score != null)
                .sorted(Comparator.comparingDouble(ScoredProfile::getScore).reversed())
                .limit(10)
                .toList();

        return ResponseEntity.ok(
                scoredProfiles.stream()
                        .map(scored -> scored.getProfile().getUserId())
                        .toList());
    };

    // Scoring About Me keywords
    // Discarding common words before comparing
    private static final Set<String> STOPWORDS = new HashSet<>(Arrays.asList(
            "a", "and", "the", "is", "in", "on", "to", "of", "with", "for", "it", "as", "at", "by", "an", "this",
            "that", "i", "you", "he", "she", "we", "they", "be", "was", "were", "like", "love", "go", "be", "with"));

    // Reusable EnglishStemmer instance (thread-local for safety in parallel
    // streams)
    private static final ThreadLocal<EnglishStemmer> STEMMER = ThreadLocal.withInitial(EnglishStemmer::new);

    double calculateAboutMeScore(String aboutMe1, String aboutMe2) {

        if (aboutMe1 == null || aboutMe1.isBlank() || aboutMe2 == null || aboutMe2.isBlank()) {
            return 0.0;
        }
        // tokenize and stem
        Set<String> words1 = tokenizeAndStem(aboutMe1);
        Set<String> words2 = tokenizeAndStem(aboutMe2);

        if (words1.isEmpty() || words2.isEmpty()) {
            return 0.0;
        }

        Set<String> union = new HashSet<>(words1);
        union.addAll(words2); // contains all unique words from aboutMe fields combined

        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);// keeps only the words that exists in both sets (common words)

        // Return the similarity score
        return (intersection.size() * 100.0) / union.size();
    }

    // Tokenization + stemming
    private Set<String> tokenizeAndStem(String text) {
        return Arrays.stream(text.toLowerCase().split("\\s+"))
                .map(word -> word.replaceAll("[^a-z]", "")) // Strip non-letters
                .filter(word -> word.length() > 1 && !STOPWORDS.contains(word)) // Filter out stopwords
                .map(this::stemWord) // Use shared stemmer
                .collect(Collectors.toSet());
    }

    // Thread-safe stemming using a shared stemmer
    private String stemWord(String word) {
        EnglishStemmer stemmer = STEMMER.get();
        stemmer.setCurrent(word);
        stemmer.stem();
        return stemmer.getCurrent();
    }

    // Scoring interests and preferences
    double calculateSimilarityScore(List<String> usersList, List<String> candidatesList) {

        if (usersList.isEmpty() || candidatesList.isEmpty())
            return 0.0; // Avoid division by zero

        Set<String> union = new HashSet<>(usersList);
        union.addAll(candidatesList);

        Set<String> intersection = new HashSet<>(usersList);
        intersection.retainAll(candidatesList);

        return (intersection.size() * 100.0) / union.size(); // Jaccard similarity
    }

    /**
     * Calculates the similarity score between two users' interests.
     * Each interest is divided into categories. This method:
     * - Calculates the Jaccard similarity for each common category.
     * - Averages the scores across all compared categories.
     */
    double calculateInterestsScore(Map<String, List<String>> userInterests,
            Map<String, List<String>> candidateInterests) {
        if (userInterests == null || candidateInterests == null || userInterests.isEmpty()
                || candidateInterests.isEmpty()) {
            return 0.0;
        }

        double totalScore = 0.0;
        int categoryCount = 0;

        for (String category : userInterests.keySet()) {
            List<String> userCategoryInterests = userInterests.getOrDefault(category, Collections.emptyList());
            List<String> candidateCategoryInterests = candidateInterests.getOrDefault(category,
                    Collections.emptyList());
            // Only compare if both users have interests in this category
            if (!userCategoryInterests.isEmpty() && !candidateCategoryInterests.isEmpty()) {
                Set<String> union = new HashSet<>(userCategoryInterests);
                union.addAll(candidateCategoryInterests);

                Set<String> intersection = new HashSet<>(userCategoryInterests);
                intersection.retainAll(candidateCategoryInterests);

                double categoryScore = (intersection.size() * 100.0) / union.size();
                totalScore += categoryScore;
                categoryCount++;
            }
        }

        if (categoryCount == 0) {
            return 0.0;
        }
        // Return the average similarity across all matched categories
        return totalScore / categoryCount;
    }

    // Scoring relationship preferences - looking for any match
    double calculateRelationshipScore(String string1, String string2) {
        List<String> usersList = stringToList(string1);
        List<String> candidatesList = stringToList(string2);

        if (usersList.stream().anyMatch(candidatesList::contains)) {
            return 100;
        } else {
            return 0;
        }

    }

    // Helper to convert String into List
    public static List<String> stringToList(String value) {
        if (value == null || value.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .collect(Collectors.toList());
    }

    private boolean isProfileComplete(UserProfile profile) {
        return profile.getFirstName() != null && !profile.getFirstName().isBlank()
                && profile.getLastName() != null && !profile.getLastName().isBlank()
                && profile.getGender() != null && !profile.getGender().isBlank()
                && profile.getAboutMe() != null && !profile.getAboutMe().isBlank()
                && profile.getInterests() != null && !profile.getInterests().isEmpty()
                && profile.getLatitude() != null
                && profile.getLongitude() != null;
    }

    private boolean arePreferencesComplete(UserPreferences preferences) {
        return preferences.getGenderPreference() != null && !preferences.getGenderPreference().isBlank()
                && preferences.getRelationshipTypes() != null && !preferences.getRelationshipTypes().isBlank()
                && preferences.getLifestylePreferences() != null && !preferences.getLifestylePreferences().isBlank()
                && preferences.getPreferredLanguages() != null && !preferences.getPreferredLanguages().isBlank()
                && preferences.getMinAge() != null && preferences.getMinAge() >= 18
                && preferences.getMaxAge() != null && preferences.getMaxAge() >= preferences.getMinAge();
    }

    private CustomUserDetails getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        return userDetails;
    }
}