package com.matchme.repository;

import com.matchme.dto.ChatDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class CustomChatRepositoryImpl implements CustomChatRepository {

   @Autowired
   private JdbcTemplate jdbcTemplate;

   @Override
   public List<ChatDTO> getUserChats(UUID userId) {
      String sql = """
         SELECT c.id AS chat_id, c.last_message_at,
                  c.user_id_1, c.user_id_2,
                  CASE 
                     WHEN c.user_id_1 = ? THEN p2.first_name || ' ' || p2.last_name 
                     ELSE p1.first_name || ' ' || p1.last_name 
                  END AS chat_partner_name,
                  CASE 
                     WHEN c.user_id_1 = ? THEN p2.profile_picture_url 
                     ELSE p1.profile_picture_url 
                  END AS chat_partner_avatar,
                  CASE 
                     WHEN c.user_id_1 = ? THEN c.user_id_2 
                     ELSE c.user_id_1 
                  END AS chat_partner_id,
                  (SELECT COUNT(*) 
                  FROM messages m 
                  WHERE m.chat_id = c.id AND m.seen = FALSE AND m.sender_id != ?) AS unread_messages_count,
                  CASE 
                     WHEN c.user_id_1 = ? THEN p1.first_name || ' ' || p1.last_name 
                     ELSE p2.first_name || ' ' || p2.last_name 
                  END AS my_name,
                  CASE 
                     WHEN c.user_id_1 = ? THEN u2.online_count
                     ELSE u1.online_count
                  END AS online_count 
         FROM chats c
         JOIN profiles p1 ON c.user_id_1 = p1.user_id
         JOIN profiles p2 ON c.user_id_2 = p2.user_id
         JOIN users u1 ON c.user_id_1 = u1.id
         JOIN users u2 ON c.user_id_2 = u2.id
         WHERE c.user_id_1 = ? OR c.user_id_2 = ?
         ORDER BY c.last_message_at DESC
      """;

      return jdbcTemplate.query(sql, new Object[]{
               userId, userId, userId, userId, userId, userId, userId, userId
      }, (rs, rowNum) ->
               new ChatDTO(
                     rs.getObject("chat_id", UUID.class),
                     rs.getObject("chat_partner_id", UUID.class),
                     rs.getString("chat_partner_name"),
                     rs.getString("chat_partner_avatar"),
                     rs.getTimestamp("last_message_at").toLocalDateTime(),
                     rs.getInt("unread_messages_count"),
                     rs.getString("my_name"),
                     rs.getInt("online_count")
               )
      );
   }
}