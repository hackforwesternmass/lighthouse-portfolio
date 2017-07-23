class Parent < ActiveRecord::Base
  belongs_to :user
  belongs_to :student, class_name: 'User'
end
