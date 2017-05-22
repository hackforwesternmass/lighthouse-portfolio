module ISODateMethods
  def convert_to_iso(value)
    value.to_time.iso8601 if value.present?
  end

  def created_at_to_iso
    convert_to_iso(created_at)
  end

  def updated_at_to_iso
    convert_to_iso(updated_at)
  end
end
