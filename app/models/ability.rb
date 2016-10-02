class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

    can :show, User, portfolio: { private: [false, nil] }
    can :show, Portfolio, private: [false, nil]
    can [:read, :download], Project
    can :read, ResumeEntry

    if user.admin?
      can :manage, :all
    elsif user.student?
      can [:show, :action_plan], User, id: user.id
      can :manage, Portfolio, user_id: user.id
      can :manage, Resource, user_id: user.id
      can :manage, ResumeEntry, user_id: user.id
      can :manage, Project, user_id: user.id
      can :manage, Meeting, user_id: user.id
      can :manage, ActionItem, meeting: { user_id: user.id }
      can :manage, Goal, user_id: user.id
    elsif user.parent?
      can [:show, :action_plan], User do |student|
        student.parents.include?(user)
      end
      can :show, Portfolio do |portfolio|
        portfolio.user.parents.include?(user)
      end
      can :read, Resource
      can :read, ResumeEntry
      can [:read, :download], Project
      can :read, Meeting
      can :read, Goal
    end
  end
end
