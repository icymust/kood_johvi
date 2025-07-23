package com.kmdb.kmdb;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * This class implements a custom converter for converting 
 * between LocalDate and String for database storage.
 * It is automatically applied to all LocalDate fields in JPA entities.
 */
@Converter(autoApply = true)
public class LocalDateStringConverter implements AttributeConverter<LocalDate, String> {
    // Define the date format to be used for conversion
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    @Override
    public String convertToDatabaseColumn(LocalDate date) {
        return (date == null) ? null : date.format(FORMATTER);
    }

    /**
     * Converts a LocalDate entity attribute to a String 
     * for storage in the database.
     * 
     *  the LocalDate object to be converted
     *  the formatted date string, or null if the input is null
     */
    @Override
    public LocalDate convertToEntityAttribute(String dbData) {
        return (dbData == null) ? null : LocalDate.parse(dbData, FORMATTER);
    }
}
