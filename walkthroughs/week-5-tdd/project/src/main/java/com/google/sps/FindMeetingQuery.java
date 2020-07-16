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

package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<String> attendees = request.getAttendees();
    long duration = request.getDuration();

    // Request duration longer than a day -> no meetings
    if (duration > TimeRange.WHOLE_DAY.duration()) {
      return Arrays.asList();
    }

    // No attendees or events -> meetings whole day
    if (attendees.isEmpty() || events.isEmpty()) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }

    List<Event> byStartTime = events.stream()
        .sorted(Comparator.comparing(Event::getWhen, TimeRange.ORDER_BY_START))
        .collect(Collectors.toList());

    List<TimeRange> freeSlots = findPossibleTimeSlots(byStartTime, attendees, duration);
    
    return freeSlots;
  }

  private List<TimeRange> findPossibleTimeSlots(Collection<Event> sortedEvents, Collection<String> attendees, long duration) {
    List<TimeRange> timeSlots = new ArrayList<>();
    
    int endTime = 0;
    for (Event ev : sortedEvents) {
      if (!Collections.disjoint(ev.getAttendees(), attendees)) {
        if (endTime == 0) {
          addTimeSlot(timeSlots, TimeRange.START_OF_DAY, ev.getWhen().start(), false, duration);
          endTime = ev.getWhen().end();
        }

        if (ev.getWhen().start() >= endTime) {
          addTimeSlot(timeSlots, endTime, ev.getWhen().start(), false, duration);
          endTime = ev.getWhen().end();
        }

        endTime = Math.max(ev.getWhen().end(), endTime);
      }
    }

    addTimeSlot(timeSlots, endTime, TimeRange.END_OF_DAY, true, duration);

    return timeSlots;
  }

  private void addTimeSlot(List<TimeRange> timesList, int start, int end, boolean inclusive, long duration) {
    if (start + duration <= end) {
      timesList.add(TimeRange.fromStartEnd(start, end, inclusive));
    }
  }
}
