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

package com.google.sps.data;

import java.util.Date;

/** A comment. */
public final class Comment {

  private final long id;
  private final String username;
  private String text;
  private final String imageId;
  private final Date date;

  public Comment(long id, String username, String text, String imageId, Date date) {
    this.id = id;
    this.username = username;
    this.text = text;
    this.imageId = imageId;
    this.date = date;
  }

  public long getId() {
    return id;
  }

  public String getUsername() {
    return username;
  }

  public String getText() {
    return text;
  }

  public String getImageId() {
    return imageId;
  }

  public Date getDate() {
    return date;
  }

  public void setText(String text) {
    this.text = text;
  }
}