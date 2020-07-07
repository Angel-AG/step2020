// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.sps.data.HttpServletUtils;
import java.io.IOException;
import java.util.Date;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that adds a new comment to datastore */
@WebServlet("/add-comments")
public class AddCommentsServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Handle POST parameters
    String username = HttpServletUtils.getParameter(request, "username", "Anonymous");
    String comment = HttpServletUtils.getParameter(request, "comment", "");
    String imageId = HttpServletUtils.getParameter(request, "imageId", "");
    
    // Send an error message
    if (imageId.isEmpty() || comment.isEmpty()) {
      response.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    Entity commentEntity = createCommentEntity(username, comment, imageId);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    response.sendRedirect("gallery.html?imageId=" + imageId + "#comments-container");
  }

  /**
   * Return a comment entity
   */
  private Entity createCommentEntity(String username, String comment, String imageId) {
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("username", username);
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("imageId", imageId);
    commentEntity.setProperty("date", new Date());
    
    return commentEntity;
  }
}
